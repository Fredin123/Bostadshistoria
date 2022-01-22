class helperFunctions{
    static cleanString(s){
        s = s.replace(/\s\s+/g, ' ');
        s = s.trim();
        return s.toLowerCase();
    }
}

export default helperFunctions;