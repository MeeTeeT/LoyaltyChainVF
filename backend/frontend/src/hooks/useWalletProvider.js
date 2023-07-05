import { useContext } from "react";
import { WalletContext } from "../contexts/walletProvider";

function useWalletProvider() {
    const context = useContext(WalletContext)
    if(!context) {
        throw new Error('Error')
    }
    return context
}

export { useWalletProvider};