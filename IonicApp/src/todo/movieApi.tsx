import axios from 'axios';
import { AuthProps } from '../auth/authApi';
import { authConfig, baseUrl, config, getLogger, withLogs } from "../core";
import { MovieProps } from "./MovieProps";

import { Plugins } from "@capacitor/core"; //capacitor plugin
const { Storage } = Plugins;

const authUrl = `http://${baseUrl}/api/auth/login`;

const movieUrl = `http://${baseUrl}/api/movie`;

export const getMovies: (token: string) => Promise<MovieProps[]> = token => {
    log("token= ",token);
    // return withLogs(axios.get(movieUrl, authConfig(token)), 'getMovies');
    var result = axios.get(movieUrl, authConfig(token));
    result.then(function (result){
        result.data.forEach(async (movie: MovieProps) =>{
            await Storage.set({
                key: movie._id!,
                value: JSON.stringify({
                    id: movie._id,
                    nume: movie.nume,
                    gen: movie.gen,
                    an_aparitie: movie.an_aparitie,
                    durata: movie.durata,
                    descriere: movie.descriere
                }),
            });
        });
    });
    return withLogs(result, "getMovies");

}

export const createMovie: (token: string, movie: MovieProps) => Promise<MovieProps[]> = (token, movie) => {
    log("token= ",token);
    // return withLogs(axios.post(movieUrl, movie, authConfig(token)), 'createMovie');
    var result = axios.post(movieUrl, movie, authConfig(token));
    result.then(async function (result){
        var movie = result.data;
        await Storage.set({
            key: movie._id!,
            value: JSON.stringify({
                id: movie._id,
                nume: movie.nume,
                gen: movie.gen,
                an_aparitie: movie.an_aparitie,
                durata: movie.durata,
                descriere: movie.descriere
            }),
        });
    });
    return withLogs(result, "createMovie");
}
  
export const updateMovie: (token: string, movie: MovieProps) => Promise<MovieProps[]> = (token, movie) => {
    // return withLogs(axios.put(`${movieUrl}/${movie._id}`, movie, authConfig(token)), 'updateMovie');
    var result = axios.put(`${movieUrl}/${movie._id}`, movie, authConfig(token));
    result.then(async function (result){
        var movie = result.data;
        await Storage.set({
            key: movie._id!,
            value: JSON.stringify({
                id: movie._id,
                nume: movie.nume,
                gen: movie.gen,
                an_aparitie: movie.an_aparitie,
                durata: movie.durata,
                descriere: movie.descriere
            }),
        });
    });
    return withLogs(result, "updateMovie");
}

export const eraseMovie: (token: string, person: MovieProps) => Promise<MovieProps[]> = (token, movie) => {
    var result = axios.delete(`${movieUrl}/${movie._id}`, authConfig(token));
    result.then(async function (r) {
        await Storage.remove({ key: movie._id! });
    });
    return withLogs(result, "deleteMovie");
};

export const logout: () => Promise<AuthProps> = () => {
    return withLogs(axios.post(authUrl, config), 'logout');
}

interface MessageData {
    type: string;
    payload: MovieProps;
  }

const log = getLogger('ws');

export const newWebSocket = (token: string, onMessage: (data: MessageData) => void) => {
    const ws = new WebSocket(`ws://${baseUrl}`);
    ws.onopen = () => {
        log('web socket onopen');
        ws.send(JSON.stringify({ type: 'authorization', payload: { token } }));
    };
    ws.onclose = () => {
        log('web socket onclose');
    };
    ws.onerror = error => {
        log('web socket on error', error);
    };
    ws.onmessage = messageEvent => {
        log('web socket onmessage');
        onMessage(JSON.parse(messageEvent.data));
    };
    return () => {
        ws.close();
    }
}

