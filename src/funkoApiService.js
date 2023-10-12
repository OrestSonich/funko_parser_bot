
import fetch from 'node-fetch'
import axios from "axios"
export const fetchRarityCards = async ( collectionName ) => {
    try {

        const response = await fetch(`https://wax.api.atomicassets.io/atomicassets/v1/templates?collection_name=${collectionName}&page=1&limit=100&order=desc&sort=name`)
        const json = await response.json()

        return json.data.filter((element) => {
            let cardRarity = element.immutable_data.rarity;
            return cardRarity === '1 of 1' || cardRarity ===  "Legendary" || cardRarity === 'Grail'
        })

    } catch (error) {
        console.error(error)
    }
};

export const fetchPacksCosts = async (collectionName) => {
    const {data} = await axios.get(`https://wax.api.atomicassets.io/atomicassets/v1/templates?collection_name=${collectionName}&schema_name=packs.drop&page=1&limit=100&order=desc&sort=created`)
    let packs = [];
    data.data.map(async el => { packs.push({
        name: el.name,
        image: "https://atomichub-ipfs.com/ipfs/" + el.immutable_data.img,
        id: el.template_id,
        collection: el.collection.name
                                        })
    })

    for (let i= 0; i < packs.length; i++ ){
        let { data } = await axios.get(`https://wax.api.atomicassets.io/atomicmarket/v1/sales/templates?symbol=WAX&template_id=${packs[i].id}&page=1&limit=1&order=desc&sort=price`)
        packs[i].price = data.data[0].price.amount
    }
    return packs
}
