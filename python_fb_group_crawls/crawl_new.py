import facebook
import json
import requests

#young creators group
facebook_group_id = '327549154019925'

# A helper function to pretty-print Python objects as JSON
def pp(o):
		print(json.dumps(o, indent=2))

# Create a connection to the Graph API with your access token
access_token = 'EAACEdEose0cBABht2FYjCr2DkkBFBHUYNNS84uu34tno0wuUgWXNTmidJO43A8adzb70rIfLhMM8AlLCOnqE3bZAGtXfYM15kZAxK36yrV9Vv43L44BoZCYagLWZB5g0ESDYe6aINtsUX0BR9wZCeSlOIJOfa3ZBJg9Q8CH4pXTAZDZD'
graph = facebook.GraphAPI(access_token, version='2.7')
items = graph.get_connections(facebook_group_id, 'feed')



allItems = []
page_counter = 0

while(True):
	try:
		allItems.append(items)
		items=requests.get(items['paging']['next']).json()
		page_counter = page_counter + 1
		print('pages: ' + str(page_counter))
	except KeyError:
		break


with open('yc_feed.json', 'w') as outfile:
    json.dump(allItems, outfile)