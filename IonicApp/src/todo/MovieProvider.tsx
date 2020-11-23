import React, { useCallback, useContext } from "react";
import { useEffect, useReducer } from "react";
import { getLogger } from "../core";
import { createMovie, eraseMovie, getMovies, newWebSocket, updateMovie } from "./movieApi";
import { MovieProps } from "./MovieProps";
import PropTypes from 'prop-types';
import { AuthContext } from "../auth";

import { Plugins } from "@capacitor/core"
import { key } from "ionicons/icons";
const { Storage } = Plugins;

const log = getLogger('MovieProvider');

type SaveMovieFn = (movie: MovieProps) => Promise<any>;
type DeleteMovieFn = (person: MovieProps) => Promise<any>;

export interface MoviesState {
    movies?: MovieProps[],
    fetching: boolean,
    fetchingError?: Error | null,
    saving: boolean,
    savingError?: Error | null,
    saveMovie?: SaveMovieFn,
    deleteMovie?: DeleteMovieFn,
}

// export interface MoviesProps extends MoviesState {
//     addMovie: () => void,
// }

interface ActionProps {
    type: string,
    payload?: any,
}

const initialState: MoviesState = {
    fetching: false,
    saving: false,
};

const FETCH_MOVIES_STARTED = 'FETCH_MOVIES_STARTED';
const FETCH_MOVIES_SUCCEEDED = 'FETCH_MOVIES_SUCCEEDED';
const FETCH_MOVIES_FAILED = 'FETCH_MOVIES_FAILED';
const SAVE_MOVIE_STARTED = 'SAVE_MOVIE_STARTED';
const SAVE_MOVIE_SUCCEEDED = 'SAVE_MOVIE_SUCCEEDED';
const SAVE_MOVIE_FAILED = 'SAVE_MOVIE_FAILED';
const DELETE_MOVIE_STARTED = "DELETE_MOVIE_STARTED";
const DELETE_MOVIE_SUCCEEDED = "DELETE_MOVIE_SUCCEEDED";
const DELETE_MOVIE_FAILED = "DELETE_MOVIE_FAILED";

const reducer: (state: MoviesState, action: ActionProps) => MoviesState =
    (state, {type, payload }) =>{
        switch(type) {
            case FETCH_MOVIES_STARTED:
                return {...state, fetching: true, fetchingError: null };
            case FETCH_MOVIES_SUCCEEDED:
                return { ...state, movies: payload.movies, fetching: false };
            case FETCH_MOVIES_FAILED:
                return { ...state, fetchingError: payload.error, fetching: false };                    
            case SAVE_MOVIE_STARTED:
                return { ...state, savingError: null, saving: true};
            case SAVE_MOVIE_SUCCEEDED:
                const movies = [...(state.movies || [])];
                const movie = payload.movie;
                log("movieeeeee: ", movie);
                if (movie._id !== undefined){
                    const index = movies.findIndex(it => it._id === movie._id);
                    log("index: ", index);
                    if (index === -1) {
                        log("movies inainte de splice: ", movies);
                        movies.splice(0, 0, movie);
                        log("movies dupa de splice: ", movies);
                    } else {
                        log("moviie[index]1: ", movies[index]);
                        movies[index] = movie;
                        log("moviie[index]2: ", movies[index]);
                    }
                    return { ...state,  movies, saving: false };
                }
            case SAVE_MOVIE_FAILED:
                return { ...state, savingError: payload.error, saving: false };
            case DELETE_MOVIE_STARTED:
                return { ...state, deletingError: null, deleting: true };
            case DELETE_MOVIE_SUCCEEDED: {
                const movies = [...(state.movies || [])];
                const movie = payload.movie;
                const index = movies.findIndex((it) => it._id === movie._id);
                movies.splice(index, 1);
                return { ...state, movies, deleting: false };
            }
            case DELETE_MOVIE_FAILED:
                return { ...state, deletingError: payload.error, deleting: false };
                default:
            return state;
        }
    };

export const MovieContext = React.createContext<MoviesState>(initialState);

interface MovieProviderProps {
    children: PropTypes.ReactNodeLike,
}

export const MovieProvider: React.FC<MovieProviderProps> = ({ children }) => {
    const { token } = useContext(AuthContext);
    const [state, dispatch] = useReducer(reducer, initialState);
    const { movies, fetching, fetchingError, saving, savingError } = state;

    useEffect(getMoviesEffect, [token]);
    useEffect(wsEffect, [token]);
    const saveMovie = useCallback<SaveMovieFn>(saveMovieCallback, [token]);
    const deleteMovie = useCallback<DeleteMovieFn>(deleteMovieCallback, [token]);
    const value = { movies, fetching, fetchingError, saving, savingError, saveMovie, deleteMovie};
    log('returns');
     return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
    
function getMoviesEffect() {
    let canceled = false;
    fetchMovies();
    return () => {
      canceled = true;
    }

    async function fetchMovies() {
        if (!token?.trim()) {
            return;
        }
        try {
            log('fetchMovies started');
            dispatch({ type: FETCH_MOVIES_STARTED });
            const movies = await getMovies(token);
            log('fetchMovies succeeded');
            if (!canceled) {
                dispatch({ type: FETCH_MOVIES_SUCCEEDED, payload: { movies }});
            }
        } catch ( error) {
            log('fetchMovies failed');
            //dispatch({ type: FETCH_MOVIES_FAILED, payload: { error }});
            let realKeys: string[] = [];
            await Storage.keys().then( (keys)  => {
                return keys.keys.forEach(function (value) {
                    if (value !== "user")
                        realKeys.push(value);
                })
            });
        
            let values: string[] = [];
            for (const key1 of realKeys) {
                await Storage.get({key: key1}).then((value)=>{
                    // @ts-ignore
                    values.push(value.value);
                })
            }
 
            const movies: MovieProps[] = [];
            for(const value of values){
                var movie = JSON.parse(value);
                movies.push(movie);
            }
            log(movies);
            if (!canceled) {
                dispatch({ type: FETCH_MOVIES_SUCCEEDED, payload: { movies }});
            }
        }
    }    
}

async function saveMovieCallback(movie: MovieProps) {
    try {
        log("mvvvv Inceput: ", movie);
      log('saveMovie started');
      dispatch({ type: SAVE_MOVIE_STARTED });
      log("mvvvv Inceput id: ", movie._id);
      const savedMovie = await (movie._id ? updateMovie(token, movie) : createMovie(token, movie));
      log("savedMovie: ", savedMovie);
      log('saveMovie succeeded');
      dispatch({ type: SAVE_MOVIE_SUCCEEDED, payload: { movie: savedMovie } });
    } catch (error) {
      log('saveMovie failed');
      dispatch({ type: SAVE_MOVIE_FAILED, payload: { error } });
    }
  }

  async function deleteMovieCallback(movie: MovieProps) {
    try {
        log("delete started");
        dispatch({ type: DELETE_MOVIE_STARTED });
        const deletedMovie = await eraseMovie(token, movie);
        log("delete succeeded");
        console.log(deletedMovie);
        dispatch({ type: DELETE_MOVIE_SUCCEEDED, payload: { movie: movie } });
    } catch (error) {
        log("delete failed");
        dispatch({ type: DELETE_MOVIE_FAILED, payload: { error } });
    }
}

  function wsEffect() {
      let canceled = false;
      log('wsEffect - connecting');
      let closeWebSocket: () => void;
      if (token?.trim()) {
        closeWebSocket = newWebSocket(token, message => {
          if(canceled) {
              return;
          }
          const { type, payload: movie } = message;
          log(`ws message, movie ${type}`);
          if(type === 'created' || type === 'updated') {
              dispatch({ type: SAVE_MOVIE_SUCCEEDED, payload: { movie }});
          }
      });
    }
      return () => {
          log('wsEffect - disconnecting');
          canceled = true;
          closeWebSocket?.();
      }
  }
};



