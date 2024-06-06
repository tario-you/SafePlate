import json

def compare_json_keys(data1, data2, fpath, path=''):
    # Load JSON files
    # print(f"{data1=}")
    # print(f"{data2=}")
    # input()
    
    if isinstance(data1, dict) and isinstance(data2, dict):
        keys1 = data1.keys()
        keys2 = data2.keys()

        for key in keys1:
            if key not in keys2:
                pathkey = f'{path}.{key}'
                # missings[fpath].append(f"{pathkey:40s} missing in\t{fpath}")
                missings[fpath].append(f"{pathkey}")
        
        for key in data1.keys():
            compare_json_keys(data1[key], data2.get(key, {}), fpath, f"{path}.{key}")



# Paths to JSON files
parent_path = "localization/translations/"

jsons = [ "en.json", "ru.json", "cn.json", "nothing.json", "ar.json","fr.json","sp.json","tw.json"]
datas = []
missings = {j: [] for j in jsons}

for j in jsons:
    with open(parent_path+j, 'r') as file:
        datas.append(json.load(file))

for i in range(len(jsons)):
    for j in range(1,len(jsons)):
        compare_json_keys(datas[i], datas[j], jsons[j])

print()
for m in missings:
    if len(missings[m]) != 0:
        print(m)
        for k in missings[m]:
            print(k)
        print()