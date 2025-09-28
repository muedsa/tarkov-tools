export default function MapsPage() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col row-start-2">
        <ol className="list-inside list-disc">
          <div className="text-gold-one">图片文件很大 建议下载到本地</div>
          <li>
            <a href="/tarkov/images/maps/ground-zero-3d.png" target="_blank">
              中心区 3D
            </a>
          </li>
          <li>
            <a href="/tarkov/images/maps/customs-3d.jpg" target="_blank">
              海关 3D
            </a>
          </li>
          <li>
            <a href="/tarkov/images/maps/factory-3d.jpg" target="_blank">
              工厂 3D
            </a>
          </li>
          <li>
            <a href="/tarkov/images/maps/woods-3d.jpg" target="_blank">
              森林 3D
            </a>
          </li>
          <li>
            <a href="/tarkov/images/maps/interchange-3d.png" target="_blank">
              立交桥 3D
            </a>
          </li>
          <li>
            <a
              href="/tarkov/images/maps/interchange-ultra-3d.jpg"
              target="_blank"
            >
              立交桥-商场 3D
            </a>
          </li>
          <li>
            <a href="/tarkov/images/maps/shoreline-3d.jpg" target="_blank">
              海岸线 3D
            </a>
          </li>
          <li>
            <a href="/tarkov/images/maps/shoreline-resort.png" target="_blank">
              海岸线-疗养院内部
            </a>
          </li>
          <li>
            <a href="/tarkov/images/maps/reserve-3d.jpg" target="_blank">
              储备站 3D
            </a>
          </li>
          <li>
            <a
              href="/tarkov/images/maps/reserve-tunnels-3d.png"
              target="_blank"
            >
              储备站-地下通道 3D
            </a>
          </li>
          <li>
            <a
              href="/tarkov/images/maps/lighthouse-vert-3d.png"
              target="_blank"
            >
              灯塔 (垂直地图) 3D
            </a>
          </li>
          <li>
            <a href="/tarkov/images/maps/lighthouse-iso-3d.png" target="_blank">
              灯塔 (水平地图) 3D
            </a>
          </li>
          <li>
            <a
              href="/tarkov/images/maps/streets-of-tarkov-3d.jpg"
              target="_blank"
            >
              街区 3D
            </a>
          </li>
          <li>
            <a
              href="/tarkov/images/maps/streets-of-tarkov-lexos-minefield.png"
              target="_blank"
            >
              街区 4S店雷区
            </a>
          </li>
          <li>
            <a href="/tarkov/images/maps/labyrinth-3d.png" target="_blank">
              迷宫 3D
            </a>
          </li>
          <li>
            <a href="/tarkov/images/maps/labyrinth-3d.png" target="_blank">
              迷宫 3D
            </a>
          </li>
          <li>
            <a href="/tarkov/images/maps/labs.png" target="_blank">
              实验室
            </a>
          </li>
          <hr className="my-2"></hr>
          <div className="text-gold-one">收集于</div>
          <li>
            <svg
              className="inline"
              xmlns="http://www.w3.org/2000/svg"
              width="17"
              height="17"
              viewBox="0 0 24 24"
            >
              <g fill="none">
                <path d="M24 0v24H0V0zM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022m-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"></path>
                <path
                  fill="currentColor"
                  d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2m0 2a8 8 0 1 0 0 16a8 8 0 0 0 0-16m1.741 2.99a3.092 3.092 0 0 1 2.793.846c1.525 1.524 1.052 4.081-.865 4.982l-.173.075l-.09.036a1 1 0 0 1-.848-1.808l.106-.05l.09-.035a1.092 1.092 0 0 0-.486-2.103l-.135.018l-.1.02c-.558.112-.97.574-1.026 1.13l-.007.13v3.539a3.284 3.284 0 0 1-2.458 3.178l-.283.062a3.092 3.092 0 0 1-2.793-.845c-1.524-1.525-1.052-4.082.865-4.983l.173-.075l.09-.035a1 1 0 0 1 .848 1.807l-.106.05l-.089.035a1.092 1.092 0 0 0 .485 2.103l.135-.018l.1-.02c.558-.112.97-.574 1.027-1.13l.006-.13v-3.538a3.284 3.284 0 0 1 2.458-3.179l.182-.042z"
                ></path>
              </g>
            </svg>
            逃离塔科夫百科
          </li>
          <li>
            <a href="https://reemr.se" target="_blank">
              reemr.se (3D地图作者)
            </a>
          </li>
        </ol>
      </main>
    </div>
  );
}
