import {useState} from 'react';
import  * as React from 'react';
import { Text, TextInput } from 'react-native-paper';

const ViaCep=()=>{
    let [cep, setCep] = useState("")
   
    const BuscaCep=()=>{
        let url = `https://viacep.com.br/ws/${cep}/json/`
    }
    return(
        <>
            <Text variant='displayLarge'>Via CEP Rest</Text>
            <TextInput
            label='CEP'
            onChangeText={(value) => {setCep(value)}}
            mode='outlined'
        />
        </>
    )
}

export default ViaCep;