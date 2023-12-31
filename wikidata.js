query = `
# List of spas with one coordinate, images, Wikicommons categories, and official websites in English
SELECT ?spa ?spaLabel (SAMPLE(?coordinate) AS ?selectedCoordinate) (SAMPLE(?image) AS ?selectedImage) (SAMPLE(?commonsCategory) AS ?selectedCategory) (SAMPLE(?officialWebsite) AS ?website) WHERE {
  VALUES ?spaTypes { 
    wd:Q1341387 
    # wd:Q785952 
    wd:Q1004887 
    wd:Q28077 
    wd:Q57036 
    wd:Q177380 
    wd:Q34338776 
  }
  ?spa wdt:P31 ?spaTypes.
  FILTER NOT EXISTS { ?spa wdt:P31 wd:Q7930989. } # Exclude instances of city or town
  OPTIONAL { ?spa wdt:P625 ?coordinate. }
  OPTIONAL { ?spa wdt:P18 ?image. }
  OPTIONAL { ?spa wdt:P373 ?commonsCategory. }  # Wikicommons category
  OPTIONAL { 
    ?spa wdt:P856 ?officialWebsite. # Official website
    FILTER(lang(?officialWebsite) = "en") # Filter by language
  }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
GROUP BY ?spa ?spaLabel
`