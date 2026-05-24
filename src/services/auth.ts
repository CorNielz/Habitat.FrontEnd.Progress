export async function login(email: string, password: string) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (email && password) {
                resolve({
                    token: 'mock-token',
                    user: {
                        name: 'Pedro',
                        email,
                    },
                });
            } else {
                reject(new Error('Credenciais inválidas'));
            }
        }, 1200);
    });
}

export async function register(email: string, password: string) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
            });
        }, 1200);
    });
}