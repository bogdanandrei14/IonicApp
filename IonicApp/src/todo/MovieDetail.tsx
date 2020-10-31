import { getLogger } from "../core";
import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonLoading, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import { useContext, useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { MovieProps } from "./MovieProps";
import { MovieContext } from "./MovieProvider";

const log = getLogger('MovieDetail');


const MovieEdit: React.FC = () => {
    const { movies, saving, savingError, saveMovie } = useContext(MovieContext);
    const [nume, setNume] = useState('');
    const [gen, setGen] = useState('');
    const [an_aparitie, setAn] = useState('');
    const [durata, setDurata] = useState('');
    const [descriere, setDescriere] = useState('');
    const [movie, setMovie] = useState<MovieProps>();
    log('render');
    return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Details</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonGrid>
                <IonRow>
                    <IonCol><IonInput placeholder="Numele filmului" value={nume} onIonChange={e => setNume(e.detail.value || '')} /></IonCol>
                </IonRow>
                <IonRow>
                    <IonCol><IonInput placeholder="Gen" value={ gen } onIonChange={e => setGen(e.detail.value || '')} /></IonCol>
                    <IonCol><IonInput placeholder="Anul aparitiei" value={an_aparitie} onIonChange={e => setAn(e.detail.value || '')} /></IonCol>
                </IonRow>
                <IonRow>
                    <IonCol><IonInput placeholder="Durata" value={durata} onIonChange={e => setDurata(e.detail.value || '')} /></IonCol>
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


