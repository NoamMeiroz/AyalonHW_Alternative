import sys
import json
import random

input_data = json.loads(sys.argv[1])
data = []

for element in input_data:
    new_element = {}
    for key in element:
        new_element[key] = element[key]
    new_element['random_num'] = random.randint(1,10)
    data.append(new_element)


print json.dumps(data)
