const { MongoClient } = require('mongodb');


const url = 'mongodb://localhost:27017'; 
const client = new MongoClient(url);


const dbName = 'movieDB';

async function findMovies() {
  
  await client.connect();
  console.log('Connected to database');

  const db = client.db(dbName);
  const collection = db.collection('movies');

  
  const comparisonQuery = await collection.find({
    $or: [
      { popularity: { $lt: 50 } },
      { genre: 'Science Fiction' }
    ]
  }).toArray();

  console.log('Movies with popularity < 50 or in Science Fiction genre:', comparisonQuery);

 
  const result = await collection.find({
    adult: false,
    $or: [
      { release_date: { $lt: new Date("2024-01-01") } }, 
      { vote_count: { $gt: 50 } } 
    ]
  }).toArray();

  console.log('Non-adult movies with release date before 2024 or vote count > 50:', result);

 
  const horrorQuery = {
    genre: { $elemMatch: { $eq: 'Horror' } }, 
    popularity: { $gt: 20 } 
  };
  
  
  const horrorProjection = {
    projection: {
      title: 1,
      genre: 1,
      vote_average: 1
    }
  };
  
  const horrorResults = await collection.find(horrorQuery, horrorProjection).toArray();
  
  console.log('Movies with genre including "Horror" and popularity > 20:', horrorResults);


  const thrillerQuery = {
     
    vote_average: { $gt: 6 }, 
    genre: { $elemMatch: { $eq: 'Thriller' } }
  };

  
  const thrillerProjection = {
    projection: {
      title: 1,
      release_date: 1,
      vote_count: 1
    }
  };

  const thrillerResults = await collection.find(thrillerQuery, thrillerProjection).toArray();
  
  console.log('Movies for adults with vote average > 6 and genre including "Thriller":', thrillerResults);
  
 
  await client.close();
}


findMovies().catch(console.error);
