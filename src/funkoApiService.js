import axios from "axios"
export const fetchRarityCards = async (collectionName, series = "1") => {
    try {
        const url = `https://wax.api.atomicassets.io/atomicassets/v1/templates?collection_name=${collectionName}&schema_name=series${series}.drop&page=1&limit=100&order=desc&sort=created`;

        const response = await axios.get(url);

        if (response.status !== 200) {
            throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const jsonData = response.data;

        const filteredByRarity = jsonData.data.filter((element) => {
            const cardRarity = element.immutable_data.rarity;
            return cardRarity === '1 of 1' || cardRarity === 'Legendary' || cardRarity === 'Grail';
        });

        return Promise.all(filteredByRarity.map(async (el) => {

            const {data: realSupply} = await axios.get(`https://wax.api.atomicassets.io/atomicassets/v1/accounts?template_id=${el.template_id}&page=1&limit=100&order=desc`)
            realSupply.data.forEach(acc => {
                if (acc.account === 'mint.droppp'){
                    el.issued_supply = el.max_supply - acc.assets
                }
            })
            return el
        }))

    } catch (error) {
        console.error(error);
        return [];
    }
};

export const fetchPacksCosts = async (collectionName) => {
    try {
        const { data: templateData } = await axios.get(`https://wax.api.atomicassets.io/atomicassets/v1/templates?collection_name=${collectionName}&schema_name=packs.drop&page=1&limit=100&order=desc&sort=created`);

        return await Promise.all(templateData.data.map(async (el) => {
            const templateId = el.template_id;
            const imageUrl = `https://atomichub-ipfs.com/ipfs/${el.immutable_data.img}`;
            const collectionName = el.collection.name;

            const { data: salesData } = await axios.get(`https://wax.api.atomicassets.io/atomicmarket/v1/sales/templates?symbol=WAX&template_id=${templateId}&page=1&limit=1&order=desc&sort=price`);

            const price = salesData.data[0]?.price.amount || 0;

            const priceInUsd = ((price/100000000) * await fetchWaxUsdRate()).toFixed(3)

            return {
                name: el.name,
                image: imageUrl,
                id: templateId,
                collection: collectionName,
                price: priceInUsd,
            };
        }));

    } catch (error) {
        console.error(error);
        return [];
    }
};

const fetchWaxUsdRate = async () => {

    const {data} = await axios.get('https://rest.coinapi.io/v1/exchangerate/WAX/USD', {
        headers: {
            'Accept': 'application/json',
            'X-CoinAPI-Key': process.env.COIN_API
        }
    })

    return data.rate
}

