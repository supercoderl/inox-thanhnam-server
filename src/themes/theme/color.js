export const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

export const volcano = {
    50: '#fff2e8',
    100: '#ffd8bf',
    200: '#ffbb96',
    300: '#ff9c6e',
    400: '#ff7a45',
    500: '#fa541c',
    600: '#d4380d',
    700: '#ad2102',
    800: '#871400',
    900: '#610b00',
};

export const status = {
    notRead: '#00a0b2',
    read: 'b22a00',
    accepted: 'b28900'
};

const stringToColor = (string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

export const stringAvatar = (name) => {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name}`,
    };
}