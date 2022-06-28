// AWS
AWS.config.region = 'ap-northeast-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'ap-northeast-1:737d9df2-e342-4665-9c7d-54fb9f3dbda1',
});
let bucket = 'roly-poly-counter';

/**
 * 読込完了時処理
 */
window.onload = function() {
    // 累積データ取得
    (async () => {
        try {
            let response = await getTotalData(bucket);
            let totalData = JSON.parse(response.Body);
            reflectTotalData(totalData);
        } catch (error) {
            console.error(error);
            alert('累積データ取得エラー');
        }    
    })();
}

/**
 * カウントアップ処理
 * 
 * @param {string} name 方角,dog,cat
 */
function countUp(name) {
    if (['east','west','north','south'].includes(name)) {
        // 方角カウントアップ
        countUpWithName(name);
        // 合計カウントアップ
        countUpWithName('sum');
        // 累積比率の計算
        calcDirectionRatios();
    } else if (['dog','cat'].includes(name)) {
        // その他カウントアップ
        countUpWithName(name);
    }
}

/**
 * 計測終了処理
 */
function endCount() {
    // 本日データのリセット
    resetDailyCount();

    (async () => {
        try {
            // 累積データの取得
            let data = createTotalData();
            // 累積データをアップロード
            await uploadTotalData(JSON.stringify(data), bucket);
        } catch (error) {
            console.error(error);
            alert('累積データアップロードエラー');
        }
    })();
}

/**
 * 累積データの生成
 * 
 * @returns {object} 累積データ
 */
function createTotalData() {
    return {
        "rolyPoly": {
            "totals": {
                "east": Number(document.getElementById('east-total').innerHTML),
                "west": Number(document.getElementById('west-total').innerHTML),
                "south": Number(document.getElementById('south-total').innerHTML),
                "north": Number(document.getElementById('north-total').innerHTML),
                "sum": Number(document.getElementById('sum-total').innerHTML),
            }
        },
        "dogs": {
            "total": Number(document.getElementById('dog-total').innerHTML),
        },
        "cats": {
            "total": Number(document.getElementById('cat-total').innerHTML),
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
async function getTotalData(bucket, key = 'data/data.json') {
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
async function uploadTotalData(data, bucket, key = 'data/data.json') {
    await new AWS.S3.ManagedUpload({
        params: {
            Bucket: bucket,
            Key: key,
            Body: data
        }
    }).promise();
}

/**
 * 累積データを表示に反映
 * 
 * @param {object} data 累積データ
 */
function reflectTotalData(data) {
    if (data.rolyPoly) {
        let rolyPolyData = data.rolyPoly;
        ['east', 'west', 'south', 'north', 'sum'].forEach((direction) => {
            if (!rolyPolyData.totals) {
                return;
            }
            if (rolyPolyData.totals[direction]) {
                document.getElementById(direction + '-total').innerHTML = rolyPolyData.totals[direction];
            }
        });
        // 累積方角比率の計算
        calcDirectionRatios();
    }
    if (data.dogs && data.dogs.total) {
        document.getElementById('dog-total').innerHTML = data.dogs.total;
    }
    if (data.cats && data.cats.total) {
        document.getElementById('cat-total').innerHTML = data.cats.total;
    }
}

/**
 * 指定名のカウントアップ
 * 
 * @param {string} name 方角,"sum","dog","cat"
 */
function countUpWithName(name) {
    let countElement = document.getElementById(name + '-count');
    countElement.innerHTML = Number(countElement.innerHTML) + 1;
    let totalElement = document.getElementById(name + '-total');
    totalElement.innerHTML = Number(totalElement.innerHTML) + 1;
}

/**
 * 全累積方角比率の計算
 */
function calcDirectionRatios() {
    let total = Number(document.getElementById('sum-total').innerHTML);
    ['east', 'west', 'south', 'north'].forEach((direction) => {
        let ratio = calcDirectionRatio(direction + '-total', total);
        document.getElementById(direction + '-ratio').innerHTML = ratio + '%';
    });
}

/**
 * 累計方角比率の計算
 * 
 * @param {string} id エレメントID
 * @param {number} total 累計
 * @return {number} 累計比率
 */
function calcDirectionRatio(id, total) {
    let count = Number(document.getElementById(id).innerHTML);
    return total === 0 ? 0 : Math.round(count / total * 100);
}

/**
 * 今日分のカウンターのリセット
 */
function resetDailyCount() {
    ['east', 'west', 'south', 'north', 'sum', 'dog', 'cat'].forEach((name) => {
        document.getElementById(name + '-count').innerHTML = 0;
    });
}
