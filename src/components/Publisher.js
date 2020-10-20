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
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";


export const Publisher = ({setRoute, id}) => {

    const [publisher, setPublisher] = useState(null)

    const [selectedDomain, setSelectedDomain] = useState('')
    const [newEntry, setNewEntry] = useState('')

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

    const newId = () => {

        for (let i = 1; i < 100000; i++) {

            if (!domains.find(e => e.id === i)) return i

        }

    }

    const addEntry = (is_app = false) => {

        setDomains(prev => prev.map(d => {

            if (d.id === selectedDomain) {

                if (!d.entries.find(e => e.name === newEntry && is_app === e.is_app)) {

                    d.entries.push({
                        name: newEntry,
                        domain_id: selectedDomain,
                        is_app
                    })

                }

            }

            return d

        }))

    }

    const deleteEntry = id => {

        setDomains(prev => prev.map(d => {

            d.entries = d.entries.filter(e => e.id !== id)

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
                  style={{padding: '1rem'}}
                  direction={"column"} alignItems={"center"} component={Paper}>

                <Grid container
                      direction="row"
                      justify="space-around"
                      style={{marginBottom: '1rem'}}
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

                {domains.length > 0
                    ? <>
                        <Grid item>
                            <Typography variant={"h5"}>Entries</Typography>
                        </Grid>

                        <Grid item
                              style={{margin: '1rem'}}
                        >

                            <FormControl style={{
                                minWidth: 150,
                                marginRight: '1rem'
                            }}>
                                <InputLabel id="demo-simple-select-label">attach to...</InputLabel>
                                <Select
                                    value={selectedDomain}
                                    onChange={e => setSelectedDomain(e.target.value)}
                                >
                                    {domains.map(d => <MenuItem
                                        value={d.id}
                                        key={'selecteddomainskeycewvv' + d.id}
                                    >{d.name}</MenuItem>)}
                                </Select>
                            </FormControl>

                            <TextField label="New entry"
                                       onChange={e => setNewEntry(e.target.value)}
                                       value={newEntry}/>

                            <Button variant="contained" color="primary"
                                    style={{margin: '1rem'}}
                                    disabled={newEntry === '' || !selectedDomain}
                                    onClick={() => addEntry()}
                            >
                                add ads
                            </Button>

                            <Button variant="contained" color="primary"
                                    style={{margin: '1rem'}}
                                    disabled={newEntry === '' || !selectedDomain}
                                    onClick={() => addEntry(true)}
                            >
                                add app-ads
                            </Button>


                        </Grid>
                    </>
                    : null}

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

                                // console.log('domain', d)

                                return <Grid container
                                             key={'listdomainskey' + d.id}
                                             component={Paper}
                                             style={{
                                                 margin: '1rem',
                                                 backgroundColor: "#a6d4fa"
                                             }}
                                >
                                    <Grid item
                                          style={{margin: '1rem'}}
                                    >

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

                                    </Grid>

                                    {
                                        [
                                            {text: 'ads.txt', is_app: false},
                                            {text: 'app-ads.txt', is_app: true},
                                        ].map(g => {

                                                // if (!d.ns_ads && g.is_app) return null
                                                // if (!d.ns_app_ads && g.is_app) return null

                                                return <Grid container
                                                             key={'gridadsqwexunrfe' + g.text}
                                                             style={{marginBottom: '1rem'}}
                                                             direction={"column"} alignItems={"center"}
                                                >
                                                    <Typography variant={"h6"}>{g.text}</Typography>
                                                    <List>
                                                        {d.entries.filter(e => {

                                                            // console.log(e)

                                                            return (e.is_app === g.is_app && d.id === e.domain_id)
                                                        })
                                                            .map(e => <ListItem key={'listentrfewfcsdkey' + e.name + e.id}>
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

                                                </Grid>
                                            }
                                        )
                                    }

                                </Grid>
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