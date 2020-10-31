import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonList, IonLoading, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import React, { useContext } from "react";
import { getLogger } from "../core";
import Movie from "./Movie";
import { add } from 'ionicons/icons';
import { MovieContext } from "./MovieProvider";
import { RouteComponentProps } from "react-router";


const log = getLogger('MovieList');


const MovieList: React.FC<RouteComponentProps> = ({ history }) => {
    const {movies, fetching, fetchingError} = useContext(MovieContext);
    log('render')
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>MovieBox</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLoading isOpen = {fetching} message = "Fetching movies" />
                {movies && (
                    <IonList>
                        {movies.map(({id, nume, gen, an_aparitie, durata, descriere}) => 
                            <Movie key={id} id={id} nume={nume} gen={gen} an_aparitie={an_aparitie} durata={durata} descriere={descriere} onEdit={id => history.push(`/movie/${id}`)} />)}      
                    </IonList>
                )}
                {fetchingError && (
                    <div>{ fetchingError.message || 'Failed to fetch movies'}</div>
                )}
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={() => history.push(`/movie`)}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>
            </IonContent>
        </IonPage>
    );
};

export default MovieList;

