import sys
import json
import random

# print(sys.argv[1])
# input_data = json.loads(sys.argv[1])
#input_data = {}
# print(sys.argv[1])

input_data = json.loads(sys.argv[1])
input_data['random'] = random.randint(1,10)
output = json.dumps(input_data)
print output


    




#print "Hello World!"
sys.stdout.flush()