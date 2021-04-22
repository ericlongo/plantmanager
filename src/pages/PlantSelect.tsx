import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator
} from 'react-native';

import { Header } from '../components/Header';
import { EnviromentButton } from '../components/EnviromentButton';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Load } from '../components/Load';

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
    const [filteredPlants, setfilteredPlants] = useState<PlantsProps[]>([]);
    const [enviromentSelected, setEnviromentSelected] = useState('all');
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loadedAll, setLoadedAll] = useState(false);

    //Função para pegar o clique do filtro
    function handleEnviromentSelected(enviroment: string) {
        setEnviromentSelected(enviroment);

        if(enviroment == 'all') {
            return setfilteredPlants(plants);
        }

        const filtered = plants.filter(plant => 
            plant.environments.includes(enviroment)
        );

        setfilteredPlants(filtered);
    }

    async function fetchPlants(){
        // const { data } = await api.get('plants');
        const { data } = await api.get(`plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

        if(!data) {
            return setLoading(true);
        }

        if( page > 1 ) {
            setPlants( oldValue => [ ... oldValue, ... data ] );
            setfilteredPlants( oldValue => [ ... oldValue, ... data ] );
        }else {
            setPlants(data);
            setfilteredPlants(data);
        }

        setLoading(false);
        setLoadingMore(false);
    };

    function handleFetchMore(distance: number) {
        if( distance < 1 ) {
            return;
        }

        setLoadingMore(true);
        setPage(oldValue => oldValue + 1);

        fetchPlants();

    }

    // Carrega antes da tela ser montada
    useEffect(() => {
        async function fetchEnviroment(){
            // const { data } = await api.get('plants_environments');
            const { data } = await api.get('plants_environments?_sort=title&_order=asc');
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
        fetchPlants();
    }, []);

    if(loading) {
        return <Load />
    }

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
                            active={item.key == enviromentSelected}
                            onPress={ () => handleEnviromentSelected(item.key) }
                        />
                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.enviromentList}
                />
            </View>

            <View style={styles.plants}>
                <FlatList
                    data={filteredPlants}
                    renderItem={({ item }) => (
                        <PlantCardPrimary  data={item} />
                    )}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    onEndReachedThreshold={0.1}
                    onEndReached={({ distanceFromEnd }) =>
                        handleFetchMore(distanceFromEnd) 
                    }
                    ListFooterComponent={
                        loadingMore ?
                        <ActivityIndicator color={colors.green} /> : <></>
                    }
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