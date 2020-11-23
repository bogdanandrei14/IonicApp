import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonList, IonLoading, IonPage, IonSearchbar, IonSelect, IonSelectOption, IonTitle, IonToolbar } from "@ionic/react";
import React, { useContext, useEffect, useState } from "react";
import { getLogger } from "../core";
import Movie from "./Movie";
import { add, logOut } from 'ionicons/icons';
import { MovieContext } from "./MovieProvider";
import { RouteComponentProps } from "react-router";

import { baseUrl, config, withLogs } from '../core';
import { logout } from "./movieApi";
import { AuthContext } from "../auth/AuthProvider";
import { MovieProps } from "./MovieProps";

import './Style.css'


const log = getLogger('MovieList');

const MovieList: React.FC<RouteComponentProps> = ({ history }) => {
    const { logout } = useContext(AuthContext);
    const {movies, fetching, fetchingError} = useContext(MovieContext);
    
    const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
    const [pos, setPos] = useState(11);
    const [filter, setFilter] = useState<string | undefined>("any type");
    const selectOptions = ["Any type", "Comedie", "Horror", "Actiune", "Aventura", "SF", "Drama"];
    const [searchText, setSearchText] = useState<string>("");
    const [moviesShow, setMoviesShow] = useState<MovieProps[]>([]);

    async function searchNext($event: CustomEvent<void>){
        if (movies && pos < movies.length) {
            setMoviesShow([...movies.slice(0,11+pos)]);
            setPos(pos + 11);
        }
        else {
            setDisableInfiniteScroll(true);
        }
        log('movies from ' + 0 + " to " + pos);
        log("moviesShow: ",moviesShow)
        await ($event.target as HTMLIonInfiniteScrollElement).complete();    
    }
    log('render')
    useEffect(() => {
        if (movies?.length) {
            setMoviesShow(movies.slice(0, pos));
        }
    }, [movies]);

    // Search
    useEffect(() => {
        if(searchText === "" && movies) {
            setMoviesShow(movies);
        }
        if (searchText && movies){
            setMoviesShow(movies.filter((movie) => movie.nume.toLowerCase().includes(searchText.toLowerCase())));
        }
    }, [searchText]);

    // Filter
    useEffect(() => {
        if (filter && movies) {
            if (filter === "Comedie"){
                setMoviesShow(movies.filter((movie) => movie.gen === "Comedie"));
            }
            else if (filter === "Horror"){
                setMoviesShow(movies.filter((movie) => movie.gen === "Horror"));
            }
            else if (filter === "Actiune"){
                setMoviesShow(movies.filter((movie) => movie.gen === "Actiune"));
            }
            else if (filter === "Aventura"){
                setMoviesShow(movies.filter((movie) => movie.gen === "Aventura"));
            }
            else if (filter === "SF"){
                setMoviesShow(movies.filter((movie) => movie.gen === "SF"));
            }
            else if (filter === "Drama"){
                setMoviesShow(movies.filter((movie) => movie.gen === "Drama"));
            }
            else if (filter === "Any type"){
                setMoviesShow(movies);
            }
        }
    }, [filter]);
    log("return log");
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>MovieBox</IonTitle>
                    <IonButtons slot="end">
                        <IonButton onClick={logout}>
                            <IonIcon color="light" icon={logOut} />
                        </IonButton>
                        <IonButton onClick={() => history.push(`/movie`)}>
                            <IonIcon color="light" icon={add} />
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
                <IonSearchbar className="searchBar" color="dark" value={searchText} debounce={500} onIonChange={(e) => setSearchText(e.detail.value!)} />
                <IonItem className="ionItem" color="dark">
                    <IonLabel>Filter movies by type</IonLabel>
                    <IonSelect value={filter} onIonChange={(e) => setFilter(e.detail.value)}>
                        {selectOptions.map((option) => (
                            <IonSelectOption key={option} value={option}>
                                {option}
                            </IonSelectOption>    
                        ))}
                    </IonSelect>
                </IonItem>
            </IonHeader>
            <IonContent className={"content"}>
                <IonLoading isOpen = {fetching} message = "Fetching movies" />
                {/* {moviesShow && (
                    // <IonList>
                    //     {movies.map(({_id, nume, gen, an_aparitie, durata, descriere}) => 
                    //         <Movie key={_id} _id={_id} nume={nume} gen={gen} an_aparitie={an_aparitie} durata={durata} descriere={descriere} onEdit={id => history.push(`/movie/${id}`)} />)}      
                    // </IonList>
                    <IonList>
                        {moviesShow.map(({_id, nume, gen, an_aparitie, durata, descriere}) => 
                            <Movie key={_id} _id={_id} nume={nume} gen={gen} an_aparitie={an_aparitie} durata={durata} descriere={descriere} onEdit={id => history.push(`/movie/${id}`)} />)}      
                    </IonList>
                )} */}

                {moviesShow &&
                moviesShow.map(({_id, nume, gen, an_aparitie, durata, descriere}) => {
                    return (
                        <IonList lines={"none"} className={"list"}>
                            <Movie key={_id} _id={_id} nume={nume} gen={gen} an_aparitie={an_aparitie} durata={durata} descriere={descriere} onEdit={id => history.push(`/movie/${id}`)} />
                        </IonList>
                    );
                })}     

                <IonInfiniteScroll threshold="75px" disabled={disableInfiniteScroll} onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
                    <IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Loading for more movies..."/>
                </IonInfiniteScroll>

                {fetchingError && (
                    <div>{ fetchingError.message || 'Failed to fetch movies'}</div>
                )}
            </IonContent>
        </IonPage>
    );
};

export default MovieList;









// const MovieList: React.FC<RouteComponentProps> = ({ history }) => {
//     const { logout } = useContext(AuthContext);
//     const {movies, fetching, fetchingError} = useContext(MovieContext);
//     log('movieees MovieList: ', movies);
//     log('render')
//     return (
//         <IonPage>
//             <IonHeader>
//                 <IonToolbar>
//                     <IonTitle>MovieBox</IonTitle>
//                     <IonButtons slot="end">
//                         <IonButton onClick={logout}>
//                             <IonIcon color="light" icon={logOut} />
//                         </IonButton>
//                         <IonButton onClick={() => history.push(`/movie`)}>
//                             <IonIcon color="light" icon={add} />
//                         </IonButton>
//                     </IonButtons>
//                 </IonToolbar>
//             </IonHeader>
//             <IonContent>
//                 <IonLoading isOpen = {fetching} message = "Fetching movies" />
//                 {movies && (
//                     // <IonList>
//                     //     {movies.map(({_id, nume, gen, an_aparitie, durata, descriere}) => 
//                     //         <Movie key={_id} _id={_id} nume={nume} gen={gen} an_aparitie={an_aparitie} durata={durata} descriere={descriere} onEdit={id => history.push(`/movie/${id}`)} />)}      
//                     // </IonList>
//                     <IonList>
//                         {movies.map(({_id, nume, gen, an_aparitie, durata, descriere}) => 
//                             <Movie key={_id} _id={_id} nume={nume} gen={gen} an_aparitie={an_aparitie} durata={durata} descriere={descriere} onEdit={id => history.push(`/movie/${id}`)} />)}      
//                     </IonList>
//                 )}
//                 {fetchingError && (
//                     <div>{ fetchingError.message || 'Failed to fetch movies'}</div>
//                 )}
//             </IonContent>
//         </IonPage>
//     );
// };

// export default MovieList;

