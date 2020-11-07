import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonList, IonLoading, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import React, { useContext } from "react";
import { getLogger } from "../core";
import Movie from "./Movie";
import { add, addCircleOutline, addOutline, addSharp, pulse } from 'ionicons/icons';
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
                {/* <IonFab vertical="bottom" horizontal="end" slot="fixed"> */}
                    <IonButtons slot="end">
                        <IonButton onClick={() => history.push(`/movie`)}>
                            <IonIcon color="light" icon={add} />
                        </IonButton>
                    </IonButtons>
                {/* </IonFab> */}
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
            </IonContent>
        </IonPage>
    );
};

export default MovieList;

