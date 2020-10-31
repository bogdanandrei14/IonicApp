import { IonButton, IonButtons, IonCol, IonContent, IonFab, IonGrid, IonHeader, IonInput, IonLabel, IonLoading, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { getLogger } from "../core";
import { MovieProps } from "./MovieProps";
import { MovieContext } from "./MovieProvider";

const log = getLogger('MovieEdit');


interface MovieEditProps extends RouteComponentProps<{
    id?: string;
}> {}

const MovieEdit: React.FC<MovieEditProps> = ({ history, match }) => {
    const { movies, saving, savingError, saveMovie } = useContext(MovieContext);
    const [nume, setNume] = useState('');
    const [gen, setGen] = useState('');
    const [an_aparitie, setAn] = useState('');
    const [durata, setDurata] = useState('');
    const [descriere, setDescriere] = useState('');
    const [movie, setMovie] = useState<MovieProps>();
    useEffect(() => {
        log('useEffect');
        const routeId = match.params.id || '';
        const movie = movies?.find(mv => mv.id === routeId);
        setMovie(movie);
        if (movie){
            setNume(movie.nume);
            setGen(movie.gen);
            setAn(movie.an_aparitie);
            setDurata(movie.durata);
            setDescriere(movie.descriere);
        }
    }, [match.params.id, movies]);
    const handleSave = () => {
        const editedMovie = movie ? { ...movie, nume, gen, an_aparitie, durata, descriere } : { nume, gen, an_aparitie, durata, descriere };
        saveMovie && saveMovie(editedMovie).then(() => history.goBack());
    };
    log('render');
    return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Edit Movie</IonTitle>
              <IonButtons slot="end">
                <IonButton>
                  EDIT
                </IonButton>
                <IonButton onClick={handleSave}>
                  Save
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonGrid>
                <IonRow>
                    <IonCol><IonLabel>Nume: </IonLabel></IonCol>
                </IonRow>
                <IonRow>
                    <IonCol><IonInput placeholder="Numele filmului" value={nume} onIonChange={e => setNume(e.detail.value || '')} /></IonCol>
                </IonRow>
                <IonRow>
                    <IonCol><IonLabel>Gen: </IonLabel></IonCol>
                </IonRow>
                <IonRow>
                    <IonCol><IonInput placeholder="Gen" value={ gen } onIonChange={e => setGen(e.detail.value || '')} /></IonCol>
                </IonRow>
                <IonRow>
                    <IonCol><IonLabel>Anul aparitiei: </IonLabel></IonCol>
                </IonRow>
                <IonRow>
                    <IonCol><IonInput placeholder="Anul aparitiei" value={an_aparitie} onIonChange={e => setAn(e.detail.value || '')} /></IonCol>
                </IonRow>
                <IonRow>
                    <IonCol><IonLabel>Durata: </IonLabel></IonCol>
                </IonRow>
                <IonRow>
                    <IonCol><IonInput placeholder="Durata" value={durata} onIonChange={e => setDurata(e.detail.value || '')} /></IonCol>
                </IonRow>
                <IonRow>
                    <IonCol><IonLabel>Descriere: </IonLabel></IonCol>
                </IonRow>
                <IonRow>
                    <IonCol><IonInput placeholder="Descriere" value={descriere} onIonChange={e => setDescriere(e.detail.value || '')} /></IonCol>
                </IonRow>
            </IonGrid>
            <IonLoading isOpen={saving} />
            {savingError && (
              <div>{savingError.message || 'Failed to save movie'}</div>
            )}
          </IonContent>
        </IonPage>
      );
    };
    
    export default MovieEdit;

