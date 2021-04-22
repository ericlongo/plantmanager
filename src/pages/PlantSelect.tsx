import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList
} from 'react-native';

import { Header } from '../components/Header';
import { EnviromentButton } from '../components/EnviromentButton';
import { PlantCardPrimary } from '../components/PlantCardPrimary';

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import api from '../services/api';


interface EnviromentProps {
    key: string;
    title: string;
}

interface PlantsProps {
    id: string;
    name: string;
    about: string;
    water_tips:string;
    photo: string;
    environments: [string];
    frequency: {
        times: number;
        repeat_every: string;
    }
}


export function PlantSelect() {

    const [enviroments, setEnviromets] = useState<EnviromentProps[]>([]);
    const [plants, setPlants] = useState<PlantsProps[]>([]);

    // Carrega antes da tela ser montada
    useEffect(() => {
        async function fetchEnviroment(){
            const { data } = await api.get('plants_environments');
            setEnviromets([
                {
                    key: 'all',
                    title: 'Todos'
                },
                ...data
            ]);
        };

        fetchEnviroment();

    }, []);

    useEffect(() => {
        async function fetchPlants(){
            const { data } = await api.get('plants');
            setPlants(data);
        };

        fetchPlants();

    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header} >
                <Header />

                <Text style={styles.title}>
                    Em qual ambiente
                </Text>
                <Text style={styles.subtitle}>
                    você quer colocar sua planta?
                </Text>
            </View>

            <View>
                <FlatList 
                    data={enviroments}
                    renderItem={({ item })=> (
                        <EnviromentButton 
                            title={item.title}
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.enviromentList}
                />
            </View>

            <View style={styles.plants}>
                <FlatList
                    data={plants}
                    renderItem={({ item }) => (
                        <PlantCardPrimary  data={item} />
                    )}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                >

                </FlatList>
            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    header: {
        paddingHorizontal: 30
    },
    title: {
        color: colors.heading,
        fontFamily: fonts.heading,
        fontSize: 17,
        lineHeight: 20,
        marginTop: 15
    },
    subtitle: {
        fontFamily: fonts.text,
        color: colors.heading,
        fontSize: 17,
        lineHeight: 20
    },
    enviromentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        paddingRight: 32,
        marginLeft: 32,
        marginVertical: 32
    },
    plants: {
        flex: 1,
        paddingHorizontal: 32,
        justifyContent: 'center'
    }
});