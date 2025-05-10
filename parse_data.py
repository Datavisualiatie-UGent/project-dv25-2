import pandas as pd
import json
import os
import math

DATA_FOLDER = "output"
os.makedirs(DATA_FOLDER, exist_ok=True)

QUESTION_LOC = (1, 7)
SUB_QUESTION_LOC = (2, 7)
HR_INDEX = 26

START_COLUMN = 2
SUBSECTIONS_START = 3
FIRST_AGE_INDEX = 8


class Question:
    def __init__(self, id, df_A, df_B):
        print(f"Parsing {id}...")
        self.id = id
        self.question = df_A.iloc[QUESTION_LOC]
        self.subquestion = str(df_A.iloc[SUB_QUESTION_LOC])
        self.old_values_A = False
        self.old_values_B = False

        self.answers = self._fix_strings(list(df_A.iloc[10:, 1])[1::2])

        # Volume A
        self.volume_A = {}

        countries = list(df_A.iloc[7, START_COLUMN:])
        for i, country in enumerate(countries):
            country_values = list(df_A.iloc[8:, START_COLUMN + i])
            self.volume_A[self._fix_name(country)] = {
                "total": country_values[0],
                "values": self._fix_values(country_values[2::2]),
                "percentages": self._fix_values(country_values[3::2])
            }

        # Volume B
        if df_B is not None:
            self.volume_B = {}

            subsections = list(df_B.iloc[6, SUBSECTIONS_START:])
            subsections_indices = [i + 3 for i, elem in enumerate(subsections) if isinstance(elem, str)] + [df_B.shape[1]]

            for i in range(len(subsections_indices) - 1):
                section_name = self._fix_name(df_B.iloc[6, subsections_indices[i]])
                section_values = {}
                for subsection_value_index in range(*subsections_indices[i:i+2]):
                    subsection_value_name = self._fix_name(df_B.iloc[7, subsection_value_index])
                    
                    subsection_values = list(df_B.iloc[8:, subsection_value_index])
                    section_values[subsection_value_name] = {
                        "total": subsection_values[0],
                        "values": self._fix_values(subsection_values[2::2]),
                        "percentages": self._fix_values(subsection_values[3::2])
                    }

                self.volume_B[section_name] = section_values

    def load_old_values(self, df_A_old, df_B_old):

        # Volume A
        self.old_values_A = True
        countries = list(df_A_old.iloc[6, START_COLUMN:])
        countries[0], countries[1] = countries[1], 0
        indices = [i for i, value in enumerate(countries) if isinstance(value, str)]

        for i in indices:
            country = self._fix_name_old(countries[i])
            country_values = list(df_A_old.iloc[8:, START_COLUMN + i])
            self.volume_A[country]["total_old"] = country_values[0]
            self.volume_A[country]["values_old"] = self._fix_values(country_values[2::2])
            self.volume_A[country]["percentages_old"] = self._fix_values(country_values[3::2])

        # Volume B
        if df_B_old is not None:
            self.old_values_B = True
            subsections = list(df_B_old.iloc[6, SUBSECTIONS_START:])
            subsections_indices = [i + 3 for i, elem in enumerate(subsections) if isinstance(elem, str)] + [df_B_old.shape[1]]

            for i in range(len(subsections_indices) - 1):
                if subsections_indices[i] == FIRST_AGE_INDEX:
                    continue
                section_name = self._fix_name(df_B_old.iloc[6, subsections_indices[i]])
                self.volume_B[section_name] = {}
                
                for subsection_value_index in range(subsections_indices[i], subsections_indices[i+1]):
                    subsection_value = df_B_old.iloc[7, subsection_value_index].split("\n-\n")
                    subsection_value_name = subsection_value[-2]
                    subsection_value_edition = subsection_value[-1]


                    self.volume_B[section_name].setdefault(subsection_value_name, {})
                    subsection_values = list(df_B_old.iloc[8:, subsection_value_index])
                    suffix = "" if subsection_value_edition == "100.1" else "_old"
                    
                    self.volume_B[section_name][subsection_value_name][f"total{suffix}"] = subsection_values[0]
                    self.volume_B[section_name][subsection_value_name][f"values{suffix}"] = self._fix_values(subsection_values[2::2])
                    self.volume_B[section_name][subsection_value_name][f"percentages{suffix}"] = self._fix_values(subsection_values[3::2])
                    
            

    def save(self, data_folder):
        with open(f"{data_folder}/question_{self.id}.json", "w") as f:
            json.dump(self.__dict__, f, indent=4)

    def get_result(self):
        return {"id": self.id, "question": self.question, "subquestion": self.subquestion, "old_values_A": self.old_values_A, "old_values_B": self.old_values_B}

    def _fix_values(self, lijst):
        return [0 if x == '-' else -1 if isinstance(x, float) and math.isnan(x) else x for x in lijst]
    
    def _fix_strings(self, lijst):
        return ["None" if type(value) != str else value for value in lijst]
    
    def _fix_name(self, string):
        return string.split("\n")[-1]
    
    def _fix_name_old(self, string):
        return string.split()[-1]



def get_path(volume):
    return f"data/EBs540_Vol_{volume}.xlsx"

def parse():
    volume_A = pd.read_excel(get_path("A"), sheet_name=None)
    volume_B = pd.read_excel("data/SP540_Vol_B.xlsx", sheet_name=None)
    volume_AP = pd.read_excel(get_path("AP"), sheet_name=None)
    volume_BP = pd.read_excel(get_path("BP"), sheet_name=None)

    results = []

    for sheet_name, df in volume_A.items():
        if sheet_name == "Content":
            continue

        question = Question(sheet_name, df, volume_B.get(sheet_name))
        if sheet_name in volume_AP:
            question.load_old_values(volume_AP[sheet_name], volume_BP.get(sheet_name))
        question.save(DATA_FOLDER)
        results.append(question.get_result())

    results_path = f"{DATA_FOLDER}/results.json"
    with open(results_path, "w") as f:
        json.dump(results, f, indent=4)

    print(f"Saved results to {results_path}")


parse()