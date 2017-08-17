import axios from 'axios';
import {AsyncStorage} from 'react-native'
export const FETCH_VEGY = 'FETCH_VEGY';
export const SELECTED_MONTHS = 'SELECTED_MONTHS';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_ACCESS = 'LOGIN_ACCESS';
export const DATA_USER = 'DATA_USER';
export const EVAL_INFO = 'EVAL_INFO';
export const EVAL_END = 'EVAL_END';
export const GET_NOTES = 'GET_NOTES';
export const DELETE_TAG = 'DELETE_TAG';
export const FETCH_VEGIES = 'FETCH_VEGIES';
export const IS_FETCHING = 'IS_FETCHING';
export const ALL_TAGS = "ALL_TAGS";

const ROUTE_URL = `https://api.vegyscan.fr`;

// -----------------
// ----- TAG -------
// -----------------

export function deleteTag (tagID) {
    return {
        type : DELETE_TAG,
        payload : tagID
    }
}

export function isFetching () {
        return {
        type : IS_FETCHING,
        payload : {isFetching : true}
    }
}

export function getVegies(searchTerm = {un: '',deux: '',trois: '',quatre:'',cinq:''}){
        const url =`${ROUTE_URL}/recherche/1`;
        const request = axios.post(url, searchTerm);
        return {
            type : FETCH_VEGIES,
            payload : request
        }
}


// Terminé l'évaluation et afficher transféré le nombre de végétaux scannés
// Si le nombre d'évaluation scanner à atteint son maximum envoyer le message "évaluation terminé"" au client & au serveur 
// & envoyé l'objet général de l'évaluation au serveur.


export function sendEval(nbrVeg, idUser, idEval, res){
    evalObj = res;
    let nbrVegScan = Object.keys(evalObj).length;
    let evaluations = [];
    for (let key in evalObj){
        if (evalObj.hasOwnProperty(key)){
            evaluations = [...evaluations, evalObj[key]];
        }
    }

    if (nbrVeg === nbrVegScan){
            //On envoie l'objet général à julien
        obj = {
            idUser,
            idEval,
            evaluations 
        }
        const url = `${ROUTE_URL}/check-champs`;
        const request = axios.post(url, obj);
        AsyncStorage.removeItem('allEvals');
        return {
            type: EVAL_END,
            payload: request
            }

    } else {
        //On envoie au scanner(BarcodeScanner), le nombre de végataux scannés
        let message;
        if(nbrVeg - nbrVegScan > 1) {
            message = ' scans restants'
        } else {
            message = ' scan restant'
        }
        return {
            type: EVAL_INFO,
            payload: {nbrVegRes : nbrVeg - nbrVegScan + message, active :true}
            }

        }
}
export function vegyFetch(link, user, etablissement){
    console.log('VEGY_FETCH')
    var link = link.split('/');
    var verif = link[0] + '//' + link[2];
    var id = link[4];
    var domain = "https://scan.vegyscan.fr";

    if (domain === verif && id) {
            console.log('VEGY_FETCH_OK',id)
        const url = `${ROUTE_URL}/api/vegetaux/${etablissement}/${id}/${user}`;
        const request = axios.get(url);
        return {
            type: FETCH_VEGY,
            payload: request
        }
    }

}



export function loginIn(obj){
    const url =`${ROUTE_URL}/api/token`;
    const request = axios.post(url,obj);
    return {
        type : LOGIN_REQUEST,
        payload : request
    }
}


export function getUserData(id){
    const url = `${ROUTE_URL}/users/${id}`;
    const request = axios.get(url);
    return {
        type : DATA_USER,
        payload : request,
    }
}

export function getUserNotes(id){
    const url = `${ROUTE_URL}/notes-user/${id}`;
    const request = axios.get(url);
    return {
        type : GET_NOTES,
        payload : request,
    }
}

export function Access(bool = true){
        return {
        type : LOGIN_ACCESS,
        payload : {login : bool}
    }

}



export function getMonthsSelected(obj){
    return {
        type : SELECTED_MONTHS,
        payload : obj,
    }
}


export function tags(array){
    return {
        type : ALL_TAGS,
        payload : array
    }
}