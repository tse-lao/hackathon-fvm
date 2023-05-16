
export default function Avatar({height, width, creator}) {

    
     function createHash(inputString) {
        return [...inputString].reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    }
    
    if(creator === undefined) {
        creator = "0x9023jslkdf|"
    }
    const hash = createHash(creator);

    const headRadius = 30 + (hash % 10);
    const eyeRadius = 2 + (hash % 3);
    const mouthWidth = 5 + (hash % 15);
    const mouthHeight = 1 + (hash % 5);

    const color = `#${((hash * 123456789) % 0xFFFFFF).toString(16).padStart(6, '0')}`;

    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" height={height} width={width}>
        <circle cx="50" cy="50" r={headRadius} fill={color} />
        <circle cx="40" cy="40" r={eyeRadius} fill="white" />
        <circle cx="60" cy="40" r={eyeRadius} fill="white" />
        <rect x="40" y="60" width={mouthWidth} height={mouthHeight} fill="white" />
      </svg>
    );
}
