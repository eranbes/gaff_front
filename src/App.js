import React, {useState} from 'react';
import {Publishers} from "./components/Publishers";
import {Publisher} from "./components/Publisher";
import {Crawl} from "./components/Crawl";
import {Reports} from "./components/Reports";

function App() {

    const [route, setRoute] = useState('reports');
    const [publisherId, setPublisherId] = useState(0);
    const [publisher, setPublisher] = useState([]);

    return route === 'publishers'
        ? <Publishers setRoute={setRoute} setPublisherId={setPublisherId} setPublisher={setPublisher}/>
        : route === 'publisher'
            ? <Publisher setRoute={setRoute} id={publisherId}/>
            : route === 'crawl'
                ? <Crawl setRoute={setRoute} publisher={publisher}/>
                : route === 'reports'
                    ? <Reports setRoute={setRoute}/>
                    : null

}

export default App;