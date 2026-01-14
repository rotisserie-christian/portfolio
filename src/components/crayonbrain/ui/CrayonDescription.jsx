const CrayonDescription = () => {
    return (
        <p>
            The visuals are made with 
            <a href="https://github.com/jberg/butterchurn" target="_blank" rel="noreferrer" className="underline ml-1">Butterchurn</a>,
            a web port of the famous 
            <a href="https://www.geisswerks.com/milkdrop/" target="_blank" rel="noreferrer" className="underline mx-1">MilkDrop</a>
            visualizer featured in Winamp.<br /><br />

            The composer builds audio data for drums, insturments, and mixer configurations.
            Data is saved/loaded with a git-like versioning system, and can be posted to a public feed.<br /><br />

            The feed is a sliding window where older posts are continually removed. 
            Posts can also be remixed, creating a new branch of audio data.<br /><br />

            Posting is optional, and other features such as visualizing uploaded audio or microphone input 
            are sandboxed to the browser.<br /><br />

            The project is designed to collect minimal user data and use very few backend services.  
        </p>
    );
};

export default CrayonDescription;
