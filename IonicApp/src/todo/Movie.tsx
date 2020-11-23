import { IonItem, IonLabel } from '@ionic/react';
import React from 'react'
import { MovieProps } from './MovieProps';


interface MoviePropsExt extends MovieProps {
    onEdit: (id?: string) => void;
}

// const Movie: React.FC<MoviePropsExt> = ({id, nume, gen, an_aparitie, durata, descriere}) => {
const Movie: React.FC<MoviePropsExt> = ({ _id, nume, gen, an_aparitie, durata, descriere, onEdit }) => {
    return (
        // <div>{nume}</div>
        <IonItem onClick={() => onEdit(_id)}>
            <IonLabel>{nume}</IonLabel>
        </IonItem>
    );
};

export default Movie;
