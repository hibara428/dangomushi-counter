// AWS
AWS.config.region = 'ap-northeast-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-1:737d9df2-e342-4665-9c7d-54fb9f3dbda1',
});
let bucket = 'roly-poly-counter';
let dataKey = 'data/data' + (new Date()).getFullYear() + '.json';

// 方角名
const DIRECTION_NAMES = ['east','west','north','south'];
// 合計名
const SUM_NAME = 'sum';
// その他の名前
const OTHER_NAMES = ['dog','cat'];
// カウンタ名
const COUNTER_NAMES = [...DIRECTION_NAMES, SUM_NAME, ...OTHER_NAMES];

/**
 * 累積データの更新
 * 
 * @param {object} beforeTotalData
 * @returns {object} 累積データ
 */
function updateTotalData(beforeTotalData) {
    return {
        "rolyPoly": {
            "totals": {
                "east": Number(beforeTotalData.rolyPoly.totals.east ?? 0) + Number(document.getElementById('east-count').innerHTML),
                "west": Number(beforeTotalData.rolyPoly.totals.west ?? 0) + Number(document.getElementById('west-count').innerHTML),
                "south": Number(beforeTotalData.rolyPoly.totals.south ?? 0) + Number(document.getElementById('south-count').innerHTML),
                "north": Number(beforeTotalData.rolyPoly.totals.north ?? 0) + Number(document.getElementById('north-count').innerHTML),
                "sum": Number(beforeTotalData.rolyPoly.totals.sum ?? 0) + Number(document.getElementById('sum-count').innerHTML),
            }
        },
        "dogs": {
            "total": Number(beforeTotalData.dogs.total ?? 0) + Number(document.getElementById('dog-count').innerHTML),
        },
        "cats": {
            "total": Number(beforeTotalData.cats.total ?? 0) + Number(document.getElementById('cat-count').innerHTML),
        }
    };
}

/**
 * 累積データ取得
 * 
 * @param {string} bucket バケット
 * @param {string} key 累積データキー
 * @returns {Promise<object>} 累積データ
 */
async function getTotalData(bucket, key) {
    let response = await loadTotalData(bucket, key);
    return JSON.parse(response.Body);
}

/**
 * 累積データ取得
 * 
 * @param {string} bucket バケット
 * @param {string} key 累積データキー
 * @returns {Promise<object>} 累積データ
 */
async function loadTotalData(bucket, key) {
    let s3 = new AWS.S3();
    return await s3.getObject({
        Bucket: bucket,
        Key: key,
    }).promise();
}

/**
 * 累積データアップロード
 * 
 * @param {object} data 累積データ
 * @param {string} bucket バケット
 * @param {string} key データキー
 */
async function uploadTotalData(data, bucket, key) {
    await new AWS.S3.ManagedUpload({
        params: {
            Bucket: bucket,
            Key: key,
            Body: data
        }
    }).promise();
}
