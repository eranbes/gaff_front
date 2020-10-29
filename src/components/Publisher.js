import React, {useState, useEffect} from 'react';
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import rest from './Rest'
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import LinearProgress from "@material-ui/core/LinearProgress";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";


export const Publisher = ({setRoute, id}) => {

    const [publisher, setPublisher] = useState(null)

    const [selectedDomain, setSelectedDomain] = useState(0)
    const [newEntry, setNewEntry] = useState('')
    const [newAssetName, setNewAssetName] = useState('')
    const [newAssetId, setNewAssetId] = useState('')

    const [newDomain, setNewDomain] = useState('')
    const [domains, setDomains] = useState([])

    const [loading, setLoading] = useState(false)

    useEffect(() => {

        if (+id > 0) {

            setLoading(true)

            rest('publishers/' + id)
                .then(res => {

                    setLoading(false)

                    if (res.status === 200) {
                        setPublisher(res.body.name)
                        setDomains(res.body.domains)
                    }

                })
        }

    }, [id])

    const newChildId = (domain) => {

        for (let i = 1; i < 100000; i++) {

            if (!(domain.assets.find(a => a.id === i) || domain.entries.find(e => e.id === i))) {
                return i
            }

        }

    }

    const newId = () => {

        for (let i = 1; i < 100000; i++) {

            if (!domains.find(e => e.id === i)) return i

        }

    }

    const addAsset = () => {

        setDomains(prev => prev.map(d => {

            if (d.id === selectedDomain) {

                console.log(d)

                if (!d.assets.find(a => a.asset_name === newAssetName && a.asset_id === newAssetId)) {

                    d.assets.push({
                        id: newChildId(d),
                        asset_name: newAssetName,
                        asset_id: newAssetId,
                        domain_id: selectedDomain,
                    })

                    setNewAssetName('')
                    setNewAssetId('')

                }

            }

            return d

        }))

    }

    const addEntry = (is_app = false) => {

        setDomains(prev => prev.map(d => {

            if (d.id === selectedDomain) {

                if (!d.entries.find(e => e.name === newEntry && is_app === e.is_app)) {

                    d.entries.push({
                        id: newChildId(d),
                        name: newEntry,
                        domain_id: selectedDomain,
                        is_app
                    })

                    setNewEntry('')

                }

            }

            return d

        }))

    }

    const deleteById = (domain_id, index, id) => {

        setDomains(prev => prev.map(d => {

            if (d.id === domain_id) {
                d[index] = d[index].filter(a => a.id !== id)
            }

            return d

        }))

    }

    const addDomain = () => {

        setDomains(prev => {

            let name = newDomain

            prev.push({
                id: newId(),
                name,
                publisher_id: id,
                assets: [],
                entries: [],
                ns_ads: false,
                ns_app_ads: true
            })

            return prev

        })

        setNewDomain('')

    }

    const handleDomain = (id, field, value) => {

        setDomains(domains.map(d => {

            if (d.id === id) {
                d[field] = value;
            }

            return d

        }))

    }

    const savePublisher = () => {

        setLoading(true)

        rest('publishers/' + id, 'PUT', {
            name: publisher,
            domains
        })
            .then(res => {

                setLoading(false)

                if (res.status === 200) {
                    setPublisher(res.body.name)
                    setDomains(res.body.domains)
                }

            })

    }

    return publisher === null
        ? <LinearProgress/>
        : <>
            <Grid container
                  direction="column"
            >

                <Grid item
                      style={{margin: '1rem'}}
                >
                    <span style={{
                        fontSize: '2rem',
                        margin: '1rem',
                    }}>
                        Publisher:
                    </span>
                    <TextField variant="outlined"
                               onChange={e => setPublisher(e.target.value)}
                               value={publisher}
                    />
                </Grid>
                Domains
                <Grid item>
                    <Box border={2}>
                        <Grid container
                              spacing={2}
                        >
                            <Grid item xs={5}
                                  style={{margin: '1rem'}}
                            >
                                <TextField label="Add new domain"
                                           variant="outlined"
                                           onChange={e => setNewDomain(e.target.value)}
                                           value={newDomain}/>

                                <Button variant="contained"
                                        color="primary"
                                        style={{
                                            margin: '1rem',
                                            backgroundColor: "#085394"
                                        }}
                                        onClick={() => addDomain()}
                                        disabled={newDomain === ''}
                                >
                                    add domain
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                {"Domains for " + publisher}
                                <Box border={1}
                                     style={{
                                         margin: '1rem',
                                         alignSelf: 'center'
                                     }}
                                >
                                    <List>
                                        {domains.map(d => <ListItem key={"listdonmjsbidgv" + d.id}>
                                            <ListItemText
                                                primary={d.name}
                                            />
                                        </ListItem>)}
                                    </List>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>

                {domains.length > 0
                    ? <Grid>
                        ads.txt/app-ads.txt/assets
                        <Box border={2}>
                            <Grid container
                                  direction="column"
                                  style={{margin: '1rem'}}
                                  spacing={2}
                            >
                                <Grid item>
                                    <FormControl
                                        variant="outlined"
                                        style={{width: '50%'}}
                                    >
                                        {/*<InputLabel>Select Domain To Attach To</InputLabel>*/}
                                        <Select
                                            value={selectedDomain}
                                            onChange={e => setSelectedDomain(e.target.value)}
                                        >
                                            <MenuItem value={0}>Select Domain To Attach To</MenuItem>
                                            {domains.map(d => <MenuItem
                                                value={d.id}
                                                key={'selecteddomainskeycewvv' + d.id}
                                            >{d.name}</MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item>
                                    <Grid container>
                                        <Grid item xs={4}>
                                            <TextField label="Your txt Entry"
                                                       variant="outlined"
                                                       fullWidth
                                                       onChange={e => setNewEntry(e.target.value)}
                                                       value={newEntry}/>
                                        </Grid>

                                        <Grid item>
                                            <Button variant="contained" color="primary"
                                                    style={{
                                                        margin: '1rem',
                                                        backgroundColor: "#009E0F"
                                                    }}
                                                    disabled={newEntry === '' || !selectedDomain}
                                                    onClick={() => addEntry()}
                                            >
                                                add to ads.txt
                                            </Button>
                                        </Grid>

                                        <Grid item>
                                            <Button variant="contained" color="primary"
                                                    style={{
                                                        margin: '1rem',
                                                        backgroundColor: "#009E0F"
                                                    }}
                                                    disabled={newEntry === '' || !selectedDomain}
                                                    onClick={() => addEntry(true)}
                                            >
                                                add to app-ads.txt
                                            </Button>
                                        </Grid>

                                    </Grid>
                                </Grid>

                                <Grid item>

                                    <Grid container spacing={1}>
                                        <Grid item xs={4}>
                                            <TextField label="Asset Name"
                                                       variant="outlined"
                                                       fullWidth
                                                       onChange={e => setNewAssetName(e.target.value)}
                                                       value={newAssetName}/>
                                        </Grid>

                                        <Grid item xs={4}>
                                            <TextField label="Asset ID"
                                                       variant="outlined"
                                                       fullWidth
                                                       onChange={e => setNewAssetId(e.target.value)}
                                                       value={newAssetId}/>
                                        </Grid>

                                        <Grid item>
                                            <Button variant="contained"
                                                    color="primary"
                                                    style={{
                                                        margin: '1rem',
                                                        backgroundColor: "#9900ff"
                                                    }}
                                                    disabled={!newAssetName || !newAssetId || !selectedDomain}
                                                    onClick={() => addAsset()}
                                            >
                                                add to assets
                                            </Button>
                                        </Grid>

                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>

                    </Grid>
                    : null}

                {domains.map(d => <Grid
                    key={'listdomainskey' + d.id}
                    style={{marginTop: '1rem'}}>
                    <Box border={2}
                         style={{
                             backgroundColor: "#B2D4E5"
                         }}
                    >
                        <Grid container justify="space-around">
                            <Grid item xs={2}
                                  style={{margin: '1rem'}}
                            >
                                <Typography variant={"h6"}>Domain</Typography>
                                <TextField
                                    onChange={e => handleDomain(d.id, 'name', e.target.value)}
                                    value={d.name}
                                    // style={{marginRight: '1rem'}}
                                />
                                <FormControlLabel
                                    control={<Checkbox
                                        checked={!!d.ns_ads}
                                        onChange={e => handleDomain(d.id, 'ns_ads', e.target.checked)}
                                    />}
                                    label="ads.txt"
                                />
                                <FormControlLabel
                                    control={<Checkbox
                                        checked={!!d.ns_app_ads}
                                        onChange={e => handleDomain(d.id, 'ns_app_ads', e.target.checked)}
                                    />}
                                    label="app-ads.txt"
                                />

                            </Grid>
                            <Grid item xs={4}
                                  style={{margin: '1rem'}}
                            >
                                <Typography variant={"h6"}>Assets</Typography>

                                {typeof d.assets === 'object' && d.assets.length > 0
                                    ?
                                    <List>
                                        {d.assets.map(a => <ListItem
                                            key={"listitforassetscildioubrgrgv" + a.id}
                                        >
                                            <ListItemText
                                                primary={a.asset_name + ' ' + a.asset_id}
                                            />
                                            <IconButton edge="end"
                                                        onClick={() => deleteById(d.id, 'assets', a.id)}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        </ListItem>)}
                                    </List>
                                    : null}

                            </Grid>

                            <Grid item xs={5}
                                  style={{margin: '1rem'}}
                            >
                                {typeof d.entries === 'object' && d.entries.length > 0
                                    ? [
                                        {text: 'ads.txt', is_app: false},
                                        {text: 'app-ads.txt', is_app: true},
                                    ].map(g => <List
                                            key={"jgicgjqhcvucgi31" + g.text}
                                        >
                                            <Typography variant={"h6"}>{g.text}</Typography>
                                            {d.entries.filter(e => e.is_app === g.is_app && d.id === e.domain_id)
                                                .map(e => <ListItem key={'listentrfewfcsdkey' + e.name + e.id}>
                                                        <ListItemText
                                                            primary={e.name}
                                                        />
                                                        <ListItemSecondaryAction>
                                                            <IconButton edge="end"
                                                                        onClick={() => deleteById(d.id, 'entries', e.id)}
                                                            >
                                                                <DeleteIcon/>
                                                            </IconButton>
                                                        </ListItemSecondaryAction>
                                                    </ListItem>
                                                )}
                                        </List>
                                    )
                                    : null}
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>)}

            </Grid>

            {loading
                ? <LinearProgress/>
                : <Grid container
                        justify="space-around"
                        style={{margin: '1rem'}}
                >

                    <Button
                        variant="contained"
                        style={{margin: '1rem'}}
                        onClick={() => setRoute('publishers')}
                    >
                        back
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{margin: '1rem'}}
                        onClick={() => savePublisher()}
                        disabled={!publisher || !!domains.find(d => !d.name)}
                    >
                        save
                    </Button>

                </Grid>}

        </>

}