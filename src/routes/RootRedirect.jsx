import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import "../Styles/RootRedirect.css"

function RootRedirect() {
    const ANS_SIZE = 5;
    const nav = useNavigate();

    function encrypt(word) {
        const chars = "AaBbCcDdEeFfGgHhIiJjKlLkMmOnNoPpQqRrSsTtUuVvWwXxYyZz";
        let result = "";
        let shift = word.length;
        let charsLength = chars.length;
        
        for(let char of word.toUpperCase()) {
            let newCharCode = char.charCodeAt(0) + shift - charsLength;
            result += chars[newCharCode];
        }
        return result;
    }

    async function fetchAnswer() {
        const url = `https://random-word-api.vercel.app/api?words=1&length=${ANS_SIZE}&type=uppercase`;
        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
            const json = await res.json();
            let ans = json[0];
            return ans;
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const word = await fetchAnswer();
                nav(`/${encrypt(word)}`, { replace: true });
            }
            catch (err) {
                console.error(err);
            }
        })();
    }, [nav]);

    return(
        <div className="loading-screen"><span>Loading game…</span></div>
    );
}

export default RootRedirect;