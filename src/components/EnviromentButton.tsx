import React from 'react';
import {
    StyleSheet,
    Text
} from 'react-native';

import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface enviromentButtonProps extends RectButtonProps {
    title: string;
    active?: boolean; //? siginifica que a variavel não é obrigatória
}

export function EnviromentButton({
    title,
    active = false,
    ... rest
} : enviromentButtonProps) {
    return (
        <RectButton
            style={[
                styles.container,
                active && styles.containerActive
            ]}
            { ... rest }
        >
            <Text style={[
                styles.text,
                active && styles.textActive    
            ]}>
                { title }
            </Text>

        </RectButton>
    )
}; 

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.shape,
        height: 46,
        width: 76,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        marginRight: 5
    },
    containerActive: {
        backgroundColor: colors.green_light
    },
    text: {
        color: colors.heading,
        fontFamily: fonts.text
    },
    textActive: {
        color: colors.green_dark,
        fontFamily: fonts.heading
    }
})