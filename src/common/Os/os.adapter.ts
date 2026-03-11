import * as os from 'os';

export class OsAdapter {

    public getServerIp ( ): string {

        // return networkInterfaces.ens17f1 [ 0 ].address;  
        const networkInterfaces = os.networkInterfaces();
        const nets = networkInterfaces;
        
        // Try to find any non-internal IPv4 address
        for (const name of Object.keys(nets)) {
            const netInterface = nets[name];
            if (netInterface) {
                for (const net of netInterface) {
                    // Skip over internal (i.e. 127.0.0.1) and non-IPv4 addresses
                    if (net.family === 'IPv4' && !net.internal) {
                        return net.address;
                    }
                }
            }
        }
        
        // Fallback to localhost if no network interface found
        return 'localhost';

    };

}