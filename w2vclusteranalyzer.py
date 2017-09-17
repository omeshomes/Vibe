from flask import Flask
from gensim.models.keyedvectors import KeyedVectors
import argparse
from functools import lru_cache
from logging import getLogger

import numpy as np
from gensim.models.word2vec import Word2Vec
from sklearn.cluster import MiniBatchKMeans
from sklearn.externals import joblib


logger = getLogger(__name__)
app = Flask(__name__)

words_to_pred = []

model = KeyedVectors.load_word2vec_format("GoogleNews-vectors-negative300.bin", binary=True)
classifier = joblib.load("model1000.pkl")

print("done")

@app.route('/')
def display():
	return "Looks like it works!"

def make_dataset(model):
    """Make dataset from pre-trained Word2Vec model.

    Parameters
    ---------
    model: gensim.models.word2vec.Word2Vec
        pre-traind Word2Vec model as gensim object.

    Returns
    -------
    numpy.ndarray((vocabrary size, vector size))
        Sikitlearn's X format.
    """
    V = model.index2word
    X = np.zeros((len(V), model.vector_size))

    for index, word in enumerate(V):
        X[index, :] += model[word]
    return X


def train(X, K):
    """Learn K-Means Clustering with MiniBatchKMeans.

    Paramters
    ---------
    X: numpy.ndarray((sample size, feature size))
        training dataset.
    K: int
        number of clusters to use MiniBatchKMeans.

    Returns
    --------
    sklearn.cluster.MiniBatchKMeans
        trained model.
    """
    logger.info('start to fiting KMeans with {} classs.'.format(K))
    classifier = MiniBatchKMeans(n_clusters=K, random_state=0)
    classifier.fit(X)
    return classifier


def main():

    import fileinput
    words_to_pred = []

    #model = KeyedVectors.load_word2vec_format("GoogleNews-vectors-negative300.bin", binary=True)
    #classifier = joblib.load("model1000.pkl")

    #print("done")

    app.run()

    for line in fileinput.input():
        words_to_pred.append(line[:-1])

    X = [model[word] for word in words_to_pred if word in model]
    classes = classifier.predict(X)

    result = []
    i = 0
    for word in words_to_pred:
        if word in model:
            result.append(str(classes[i]))
            i += 1
        else:
            result.append(str(-1))
        print(' '.join(result))


if __name__ == '__main__':
    main()
