import React, {useState} from 'react';
import {Publishers} from "./components/Publishers";
import {Publisher} from "./components/Publisher";

function App() {

    const [route, setRoute] = useState('publishers');
    const [publisherId, setPublisherId] = useState(0);

    return route === 'publishers'
        ? <Publishers setRoute={setRoute} setPublisherId={setPublisherId}/>
        : route === 'publisher'
            ? <Publisher setRoute={setRoute} id={publisherId}/>
            : null

}

export default App;