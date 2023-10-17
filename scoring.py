import json

# Open the GeoJSON file and load the JSON data
with open('data/osm_data_24k_input.geojson') as f:
# with open('data/osm_sample_data_testing.geojson') as f:
    data = json.load(f)

# Access the JSON data as variables
features = data['features'] # array

def count_properties(features):
    key_counts = {}

    # Loop through each feature and increment the count for each key
    for feature in features:
        for key in feature['properties'].keys():
            if key in key_counts:
                key_counts[key] += 1
            else:
                key_counts[key] = 1

    # Sort the keys in descending order based on their count
    sorted_keys = sorted(key_counts.keys(), key=lambda k: key_counts[k], reverse=True)

    # Print the count for each key in descending order
    for key in sorted_keys:
        print(f"{key}: {key_counts[key]}")

def calculate_score(feature):
    score = 0
    properties = feature.get('properties', {})
    super_important_properties = ['website', 'email', 'url', 'contact:email', 'contact:website', 'wikidata', 'architect']
    important_properties = ['phone', 'contact:phone', 'opening_hours', 'fee', 'tourism', 'charge', 'wikipedia']
    normal_properties = ['name', 'name:en', 'contact:facebook', 'contact:instagram', 'nudism']
    exclude = ['fixme', 'hotel']

    if any(prop in exclude for prop in properties):
        score = 0
    else:
        for prop in properties:
            if prop in super_important_properties:
                score += 50
            elif prop in important_properties:
                score += 20
            elif prop in normal_properties:
                score += 10
            else:
                score += 2
    return score

def add_scores_to_features(features):
    for feature in features:
        score = calculate_score(feature)
        feature['properties']['score'] = score

def save_geojson(features, filter_value=50):
    # sort features based on score in descending order
    features.sort(key=lambda f: f['properties']['score'], reverse=True)

    # filter features based on score >= 49
    features[:] = [f for f in features if f['properties']['score'] >= filter_value]

    # Write the updated GeoJSON to a new file / --> only 50+ points
    with open(f'data/score_output_{filter_value}plus.geojson', 'w') as f:
        json.dump(data, f, indent=2)
    
def count_scores(features):
    score_counts = {}
    total_above_50 = 0
    for feature in features:
        score = feature['properties']['score']
        if score > 50:
            total_above_50 += 1
        if score in score_counts:
            score_counts[score] += 1
        else:
            score_counts[score] = 1
    for score, count in sorted(score_counts.items(), reverse=True):
        print(f"{score},{count}")
    print(f"Total above 50: {total_above_50}")

def extract_and_print_urls(features):
    for feature in features:
        properties = feature.get('properties', {})
        wikidata = properties.get('wikidata')
        if wikidata is not None:
            urls = [properties.get('website'), properties.get('url'), 'https://www.wikidata.org/wiki/' + wikidata]
        else:
            urls = [properties.get('website'), properties.get('url')]        
        for url in urls:
            if url is not None:
                print(url)

# count_properties(features)
# add_scores_to_features(features)
# save_geojson(features, 50) # filter_value = 50
# count_scores(features)
extract_and_print_urls(features)