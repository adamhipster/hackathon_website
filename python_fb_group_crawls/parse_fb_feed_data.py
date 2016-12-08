import json
import re
from pprint import pprint

with open('yc_feed.json') as data_file:    
    data = json.load(data_file)
    
i = 0
c = 0
for hundredmessages in data:
	hm_plain_text = json.dumps(hundredmessages)
	match = re.search(r'hackathon', hm_plain_text)
	if match:
		for msg in hundredmessages['data']:
			msg_plain_text = json.dumps(msg)
			match = re.search(r'hackathon', msg_plain_text)
			if match:
				c = c + 1
				print('---')
				print(c)
				print(i)
				print(msg['updated_time']) 
				print('###')

	i = i + 1