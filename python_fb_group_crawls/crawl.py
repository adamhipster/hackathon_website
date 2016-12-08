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

# Wrap this block in a while loop so we can keep paginating requests until
# finished.
while(True):
	try:
		for item in items:
			allItems.append(item.encode('utf-8'))
		# Attempt to make a request to the next page of data, if it exists.
		items=requests.get(items['paging']['next']).json()
		page_counter = page_counter + 1
		print(items)
		print('\n\n\npages: ' + str(page_counter) +'\n\n\n') 
	except KeyError:
		# When there are no more pages (['paging']['next']), break from the
		# loop and end the script.
		break