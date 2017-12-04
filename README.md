# Vibe

A mobile app that curates a musical playlist based on your surrounding environment right now. Input a picture of your surroundings and Vibe recommends music for the moment.

The recommendation engine uses the Google Vision API to extract keyword descriptors from the input image. It then maps these descriptors to a set of genres and moods. This is done using k-means clustering, applied to a dataset of 50 million word2vec embeddings from Google. Once the set of moods are attained, the engine uses the Spotify API to return playlists that are tagged with the desired moods, which are then returned to the user.

The frontend was built in React Native using the Expo IDE, compatible with both iOS and Android. 
