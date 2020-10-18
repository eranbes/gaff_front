import React, {useState, useEffect} from 'react';
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

import rest from './Rest'
import Button from "@material-ui/core/Button";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
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


export const Publisher = ({setRoute, id}) => {

    const [publisher, setPublisher] = useState(null)
    const [entries, setEntries] = useState([])
    const [newEntry, setNewEntry] = useState('')
    const [domains, setDomains] = useState([])
    const [newDomain, setNewDomain] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        if (+id > 0) {

            setLoading(true)

            rest('publishers/' + id)
                .then(res => {

                    setLoading(false)

                    if (res.status === 200) {
                        setPublisher(res.body.name)
                        setEntries(res.body.entries)
                        setDomains(res.body.domains)
                    }

                })
        }

    }, [id])

    const newId = arr => {

        for (let i = 1; i < 100000; i++) {

            if (!arr.find(e => e.id === i)) return i

        }

    }

    const addEntry = (is_app = false) => {

        setEntries(prev => {

            let name = newEntry
            let id = newId(entries)

            prev.push({
                id,
                name,
                is_app
            })

            return prev
        })

        setNewEntry('')

    }

    const deleteEntry = id => {

        setEntries(prev => prev.filter(e => e.id !== id))

    }

    const addDomain = () => {

        setDomains(prev => {

            let name = newDomain
            let id = newId(domains)

            prev.push({
                id,
                name,
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
            entries,
            domains
        })
            .then(res => {

                setLoading(false)

            })

    }

    return publisher === null
        ? <LinearProgress/>
        : <>
            <Grid container
                  style={{marginBottom: '1rem'}}
                  direction={"column"} alignItems={"center"} component={Paper}>

                <Grid container
                      direction="row"
                      justify="space-around"
                >
                    <Grid item>
                        <IconButton onClick={() => setRoute('publishers')}>
                            <ArrowBackIcon/>
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <TextField label="Publisher"
                                   onChange={e => setPublisher(e.target.value)}
                                   value={publisher}
                        />
                    </Grid>
                    <Grid item>
                    </Grid>
                </Grid>

                <Grid item>
                    <Typography variant={"h5"}>Entries</Typography>
                </Grid>

                <Grid item
                      style={{margin: '1rem'}}
                >

                    <TextField label="New entry"
                               onChange={e => setNewEntry(e.target.value)}
                               value={newEntry}/>

                    <Button variant="contained" color="primary"
                            style={{margin: '1rem'}}
                            disabled={newEntry === ''}
                            onClick={() => addEntry()}
                    >
                        add ads
                    </Button>

                    <Button variant="contained" color="primary"
                            style={{margin: '1rem'}}
                            disabled={newEntry === ''}
                            onClick={() => addEntry(true)}
                    >
                        add app-ads
                    </Button>


                </Grid>

                {
                    [
                        {text: 'ads.txt', is_app: false},
                        {text: 'app-ads.txt', is_app: true},
                    ].map(g => <Grid container
                                     key={'gridadsqwexunrfe' + g.text}
                                     style={{marginBottom: '1rem'}}
                                     direction={"column"} alignItems={"center"} component={Paper}
                    >
                        <Typography variant={"h6"}>{g.text}</Typography>
                        <List>
                            {entries.filter(e => e.is_app === g.is_app)
                                .map(e => <ListItem key={'listentrfewfcsdkey' + e.name}>
                                        <ListItemText
                                            primary={e.name}
                                        />
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" aria-label="delete"
                                                        onClick={() => deleteEntry(e.id)}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                )}
                        </List>

                    </Grid>)
                }
                <Grid item>
                    <Typography variant={"h5"}>Domains</Typography>
                </Grid>
                <Grid item>

                    <TextField label="New domain"
                               onChange={e => setNewDomain(e.target.value)}
                               value={newDomain}/>

                    <Button variant="contained" color="primary"
                            style={{margin: '1rem'}}
                            onClick={() => addDomain()}
                            disabled={newDomain === ''}
                    >
                        add domain
                    </Button>

                    <List>
                        {domains.map(d => {

                            return <div key={'listdomainskey' + d.id}>
                                    <TextField
                                        onChange={e => handleDomain(d.id, 'name', e.target.value)}
                                        value={d.name}
                                        style={{marginRight: '1rem'}}
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
                                </div>
                            }
                        )}
                    </List>

                </Grid>

            </Grid>

            {loading
                ? <LinearProgress/>
                : <Grid container
                        justify="space-around"
                        style={{margin: '1rem'}}
                >

                    <Button
                        variant="contained"
                        color="secondary"
                        style={{margin: '1rem'}}
                        onClick={() => setRoute('publishers')}
                    >
                        cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{margin: '1rem'}}
                        onClick={() => savePublisher()}
                        disabled={publisher === ''}
                    >
                        save
                    </Button>

                </Grid>}

        </>

}