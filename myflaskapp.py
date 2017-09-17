from flask import Flask
from flask import request
from sklearn.externals import joblib
from gensim.models.keyedvectors import KeyedVectors

import json

import io
import os

# Imports the Google Cloud client library
from google.cloud import vision
from google.cloud.vision import types

print("start loading")

# Instantiates a client
client = vision.Client()

words_to_pred = []

model = KeyedVectors.load_word2vec_format("GoogleNews-vectors-negative300.bin", binary=True)
classifier = joblib.load("model1000.pkl")

print("done loading")

app = Flask(__name__)

@app.route('/', methods = ['POST'])
def display():
	s = json.loads(request.data.decode("utf-8"))
	print("here i am " + s["data"])
	file_name = s["data"]

	# Loads the image into memory
	with io.open(file_name, 'rb') as image_file:
	    content = image_file.read()

	image = client.image(content=content)
	labels = image.detect_labels()

	words_to_pred.append(labels[0].description)

	print(words_to_pred)

	X = [model[word] for word in words_to_pred if word in model]
	classes = classifier.predict(X)

	#result = []
	#i = 0
	#for word in words_to_pred:
	#    if word in model:
	#        result.append(str(classes[i]))
	#        i += 1
	#    else:
	#        result.append(str(-1))
	#print(' '.join(result))

	return labels[0].description + " " + labels[1].description + " " + labels[2].description + " : pop"


if __name__=='__main__':
    app.run()


    #file_name = os.path.join(
    #os.path.dirname(__file__), s["data"])
