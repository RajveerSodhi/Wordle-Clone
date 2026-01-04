const fs = require('fs');
fs.readFile('Utils/words.txt', 'utf8', (err: any, data: string) => {
    if (err) {
        console.error('Error reading the file: ' + err);
        return;
    }

    let words: string[] = [];
    const lines = data.split('\n');

    for (const line of lines) {
        let word = line.trim().toLowerCase();

        words.push(word);
    }

    let len3Words: string[] = [];
    let len4Words: string[] = [];
    let len5Words: string[] = [];
    let len6Words: string[] = [];
    let len7Words: string[] = [];

    let len3Ans: string[] = [];
    let len4Ans: string[] = [];
    let len5Ans: string[] = [];
    let len6Ans: string[] = [];
    let len7Ans: string[] = [];

    function processWord(word: string, wordList: string[], ansList: string[]) {
        const badEndings = ["ed", "ing", "ly"];    
        for (const ending of badEndings) {
            if (word.endsWith(ending)) { wordList.push(word); return; }
        }

        const inappropriateWords = ["fuck", "penis", "dick", "vagina", "cock", "shit", "cunt", "boob"];
        for (const inapp of inappropriateWords) {
            if (word.includes(inapp)) { wordList.push(word); return; }
        }

        if (
            word.endsWith("s") &&
            !word.endsWith("ss") &&
            !word.endsWith("us") &&
            !word.endsWith("is")
        ) { wordList.push(word); return; }

        if (!/[aeiouy]/.test(word)) { wordList.push(word); return; }

        if ((word.match(/[aeiouy]/g)?.length ?? 0) >= 4) { wordList.push(word); return; }

        if ((word.match(/[qjxvz]/g)?.length ?? 0) > 2) { wordList.push(word); return; }

        let wordMap: Map<string, number> = new Map<string, number>();
        for (const char of word) {
            let charCount = wordMap.get(char) || 0;
            wordMap.set(char, ++charCount);
            if (charCount > 2) { wordList.push(word); return; }
        }
        
        ansList.push(word);
    }

    for (const word of words) {
        switch (word.length) {
            case 3: { processWord(word, len3Words, len3Ans); break; }
            case 4: { processWord(word, len4Words, len4Ans); break; }
            case 5: { processWord(word, len5Words, len5Ans); break; }
            case 6: { processWord(word, len6Words, len6Ans); break; }
            case 7: { processWord(word, len7Words, len7Ans); break; }
            default: { break; }
        }
    }

    console.log("3 letter words: " + len3Words.length);
    console.log("4 letter words: " + len4Words.length);
    console.log("5 letter words: " + len5Words.length);
    console.log("6 letter words: " + len6Words.length);
    console.log("7 letter words: " + len7Words.length);

    console.log("3 letter ans: " + len3Ans.length);
    console.log("4 letter ans: " + len4Ans.length);
    console.log("5 letter ans: " + len5Ans.length);
    console.log("6 letter ans: " + len6Ans.length);
    console.log("7 letter ans: " + len7Ans.length);

    let totalWords = len3Words.length + len4Words.length + len5Words.length + len6Words.length + len7Words.length +
    (len3Ans.length + len4Ans.length + len5Ans.length + len6Ans.length + len7Ans.length)

    console.log("words: " + totalWords);

    fs.writeFile('Utils/len_3_words.txt', len3Words.join('\n'), (err: any) => {
        if (err) {
            console.error('Error writing to the file: ' + err);
            return;
        }
        console.log('Len 3 words have been written to the file.');
    });

    fs.writeFile('Utils/len_4_words.txt', len4Words.join('\n'), (err: any) => {
        if (err) {
            console.error('Error writing to the file: ' + err);
            return;
        }
        console.log('Len 4 words have been written to the file.');
    });

    fs.writeFile('Utils/len_5_words.txt', len5Words.join('\n'), (err: any) => {
        if (err) {
            console.error('Error writing to the file: ' + err);
            return;
        }
        console.log('Len 5 words have been written to the file.');
    });

    fs.writeFile('Utils/len_6_words.txt', len6Words.join('\n'), (err: any) => {
        if (err) {
            console.error('Error writing to the file: ' + err);
            return;
        }
        console.log('Len 6 words have been written to the file.');
    });

    fs.writeFile('Utils/len_7_words.txt', len7Words.join('\n'), (err: any) => {
        if (err) {
            console.error('Error writing to the file: ' + err);
            return;
        }
        console.log('Len 7 words have been written to the file.');
    });


    fs.writeFile('Utils/len_3_ans.txt', len3Ans.join('\n'), (err: any) => {
        if (err) {
            console.error('Error writing to the file: ' + err);
            return;
        }
        console.log('Len 3 ans have been written to the file.');
    });

    fs.writeFile('Utils/len_4_ans.txt', len4Ans.join('\n'), (err: any) => {
        if (err) {
            console.error('Error writing to the file: ' + err);
            return;
        }
        console.log('Len 4 ans have been written to the file.');
    });

    fs.writeFile('Utils/len_5_ans.txt', len5Ans.join('\n'), (err: any) => {
        if (err) {
            console.error('Error writing to the file: ' + err);
            return;
        }
        console.log('Len 5 ans have been written to the file.');
    });

    fs.writeFile('Utils/len_6_ans.txt', len6Ans.join('\n'), (err: any) => {
        if (err) {
            console.error('Error writing to the file: ' + err);
            return;
        }
        console.log('Len 6 ans have been written to the file.');
    });

    fs.writeFile('Utils/len_7_ans.txt', len7Ans.join('\n'), (err: any) => {
        if (err) {
            console.error('Error writing to the file: ' + err);
            return;
        }
        console.log('Len 7 ans have been written to the file.');
    });
})