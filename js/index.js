const rates = {
  grabCar: {
    baseKm: 8000,
    km1to19: 7500,
    kmUpto19: 7000,
    waiting: 2000,
  },
  grabSUV: {
    baseKm: 9000,
    km1to19: 8500,
    kmUpto19: 8000,
    waiting: 3000,
  },
  grabBlack: {
    baseKm: 10000,
    km1to19: 9500,
    kmUpto19: 9000,
    waiting: 4000,
  },
};

let fare = 0;
let servicesGrab = "";
let distance = 0;
let waitTime = 0;
let selectServicesGrab = "";
let resultData;
let kmBase = 0;
let km1To19 = 0;
let kmUpTo19 = 0;

// Các hàm tính toán
function baseDistance(servicesGrab, distance = 0) {
  return (kmBase =
    distance <= 1 ? servicesGrab.baseKm * distance : servicesGrab.baseKm);
}

function kmTo19Distance(servicesGrab, distance = 0) {
  if (1 < distance && distance <= 19) {
    return (km1To19 = servicesGrab.km1to19 * (distance - 1));
  } else if (distance > 19) {
    return (km1To19 = servicesGrab.km1to19 * 18);
  }
  return (km1To19 = 0);
}

function upTo19Distance(servicesGrab, distance = 0) {
  return (kmUpTo19 =
    distance > 19 ? servicesGrab.kmUpto19 * (distance - 19) : 0);
}

function calculateWaitTime(servicesGrab, waitTime) {
  return waitTime <= 3
    ? 0
    : servicesGrab.waiting * Math.ceil((waitTime - 3) / 3);
}

function totalFare(servicesGrab, distance, waitTime) {
  fare = 0;
  let details = "";
  let feeWait = "";

  // Tính tiền cơ bản cho 1 km đầu tiên
  fare += baseDistance(servicesGrab, distance);
  if (distance > 0) {
    details += `<td style="border: none">1 Km đầu tiên <br> giá ${fare.toLocaleString(
      "it-IT",
      {
        style: "currency",
        currency: "VND",
      },
    )}</td>`;
  }

  // Tính tiền cho km từ 1 đến 19
  fare += kmTo19Distance(servicesGrab, distance);
  if (km1To19 > 0) {
    details += `<td style="border: none">${Math.min(distance - 1, 18)} Km tiếp theo <br> giá ${fare.toLocaleString(
      "it-IT",
      {
        style: "currency",
        currency: "VND",
      },
    )}</td>`;
  }

  // Tính tiền cho km từ 19 trở đi
  fare += upTo19Distance(servicesGrab, distance);
  if (kmUpTo19 > 0) {
    details += `<td style="border: none">sau 19 Km <br> giá ${fare.toLocaleString(
      "it-IT",
      {
        style: "currency",
        currency: "VND",
      },
    )} với ${distance - 19} Km </td>`;
  }
  // Tính tiền thời gian chờ
  const waitingCost = calculateWaitTime(servicesGrab, waitTime);
  fare += waitingCost;
  feeWait +=
    waitTime > 3
      ? `Thời gian chờ tính phí (${waitTime - 3} phút) giá  <br> ${waitingCost.toLocaleString(
          "it-IT",
          {
            style: "currency",
            currency: "VND",
          },
        )}`
      : `Thời gian chờ tính phí 0  phút)`;

  return { fare, details, feeWait };
}

// Hàm lấy giá trị từ input
function getInputElement() {
  let selectedElement = document.querySelector(
    'input[name="selector"]:checked',
  );

  if (selectedElement) {
    selectServicesGrab = selectedElement.value;
    servicesGrab = rates[selectServicesGrab];
    distance = document.getElementById("txt-km").value * 1;
    waitTime = document.getElementById("txt-thoiGianCho").value * 1;
    return true;
  }
  return false;
}

// Sự kiện nhấn nút tính tiền
document.getElementById("tinhTien").onclick = function () {
  if (!getInputElement()) {
    return (document.querySelector(".noti").innerHTML =
      "Please select a service.");
  }

  if (distance <= 0 || waitTime < 0) {
    return (document.querySelector(".noti").innerHTML =
      "Please enter valid distance and wait time.");
  }
  resultData = totalFare(servicesGrab, distance, waitTime);
  let result = resultData.fare;

  document.getElementById("xuatTien").innerHTML = `${result} VND`;
  document.getElementById("divThanhTien").style.display = "block";
};

// Sự kiện nhấn nút in hóa đơn
document.getElementById("btnInvoice").onclick = function () {
  if (!getInputElement()) {
    return alert(
      "Please fill in all required information before generating the invoice.",
    );
  }

  // Hiển thị modal với thông tin hóa đơn
  $("#exampleModal").modal("show");
  resultData = totalFare(servicesGrab, distance, waitTime);
  let result = resultData.fare;
  document.querySelector(".content-invoice").innerHTML = `
  <table class="table">
    <thead>
      <tr>
        <th scope="col" colspan="5">Chi tiết</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="font-weight: bold">Loại xe</td>
        <td colspan="4">${selectServicesGrab}</td>
      </tr>
      <tr>
        <td style="font-weight: bold">Số Km</td>
        <td>${distance} Km</td>
        <td colspan="3">
          <table class=" distance-price">
            ${resultData.details} <!-- Chi tiết các phần của Km và giá -->
          </table>
        </td>
      </tr>
      <tr>
        <td colspan="2" style="font-weight: bold">Thời gian chờ</td>
        <td>${waitTime} phút</td>
        <td colspan="2">${resultData.feeWait}</td>
      </tr>
      <tr>
        <td colspan="4" style="font-weight: bold">Thành tiền</td>
        <td>${result.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}</td>
      </tr>
    </tbody>
  </table>
`;
};
