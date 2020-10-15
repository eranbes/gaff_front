import React, {useState} from 'react';
import {Domains} from "./components/Domains";
import {Publishers} from "./components/Publishers";
import {Publisher} from "./components/Publisher";

function App() {

    const [route, setRoute] = useState('publisher');
    const [publisherId, setPublisherId] = useState(1);

    return route === 'publishers'
        ? <Publishers setRoute={setRoute} setPublisherId={setPublisherId}/>
        : route === 'publisher'
            ? <Publisher setRoute={setRoute} id={publisherId}/>
            : route === 'domains'
                ? <Domains setRoute={setRoute}/>
                : null

}

export default App;