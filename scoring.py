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

# Scoring the Data rules:
# 2. for each important property (name, address, phone, website)        -> 2 points per important property          -> phone, contact:phone, website, wikidata, opening_hours, fee, tourism, email, contact:website, contact:email, charge, wikipedia, url
# 3. for each property that is of normal importance                     -> 1 point per normal property              -> name, name:en, contact:facebook, contact:instagram, nudism
# 4. for any other property                                             -> 0.2 point per other property 
# 5. default negative score when fixme is a key                         -> -1 point total for fixme key

def calculate_score(feature):
    score = 0
    properties = feature.get('properties', {})
    super_important_properties = ['website', 'email', 'url', 'contact:email', 'contact:website', 'wikidata', 'architect']
    important_properties = ['phone', 'contact:phone', 'opening_hours', 'fee', 'tourism', 'charge', 'wikipedia']
    normal_properties = ['name', 'name:en', 'contact:facebook', 'contact:instagram', 'nudism']
    
    for prop in properties:
        if prop in super_important_properties:
            score += 50
        elif prop in important_properties:
            score += 20
        elif prop in normal_properties:
            score += 10
        else:
            score += 2
    
    if 'fixme' in properties:
        score = 0
    
    return score

def add_scores_to_features(features):
    for feature in features:
        score = calculate_score(feature)
        feature['properties']['score'] = score



def save_geojson(features):
    # sort features based on score in descending order
    features.sort(key=lambda f: f['properties']['score'], reverse=True)

    # filter features based on score >= 49
    features[:] = [f for f in features if f['properties']['score'] >= 49]

    # Write the updated GeoJSON to a new file / --> only 50+ points
    with open('data/score_output_50plus.geojson', 'w') as f:
        json.dump(data, f, indent=2)
    
    # # Write the updated GeoJSON to a new file
    # with open('data/score_output.geojson', 'w') as f:
    #     json.dump(data, f, indent=2)

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

# count_properties(features)
add_scores_to_features(features)
save_geojson(features)

count_scores(features)