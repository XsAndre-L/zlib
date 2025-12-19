import {
  BuildType,
  CPP_OUTPUT_DIR,
  runPackageAction,
  CMAKE_TOOLS,
  getHostSysrootPath,
  SYSROOT,
  BuildConfiguration,
  LibraryInfo,
} from "../../../../src/providers/package.provider.ts";

import { join } from "node:path";
import { argv } from "node:process";

export const info: LibraryInfo = {
  name: "zlib",
  outDir: "build",
  version: "1.3.1",
};

export const build = (cwd: string = process.cwd()): BuildType => {
  const HOST_SYSROOT = getHostSysrootPath();
  const CLANG = join(HOST_SYSROOT, "bin/clang.exe").replace(/\\/g, "/");
  const CLANGXX = join(HOST_SYSROOT, "bin/clang++.exe").replace(/\\/g, "/");
  const WINDRES = join(HOST_SYSROOT, "bin/llvm-windres.exe").replace(
    /\\/g,
    "/"
  );
  const AARCH64_WINDRES = join(
    HOST_SYSROOT,
    "bin/aarch64-w64-mingw32-windres.exe"
  ).replace(/\\/g, "/");

  return {
    type: "compilation",
    windows_x86_64: {
      configStep: `cmake -S . -B ${info.outDir}/windows/x86_64 -G Ninja \
      -DCMAKE_BUILD_TYPE=Release \
      -DZLIB_BUILD_STATIC=ON \
      -DBUILD_SHARED_LIBS=ON \
      -DZLIB_BUILD_MINIZIP=OFF \
      -DZLIB_BUILD_TESTING=OFF \
      -DCMAKE_C_COMPILER=${CLANG} \
      -DCMAKE_CXX_COMPILER=${CLANGXX} \
      -DCMAKE_RC_COMPILER=${WINDRES} \
      -DCMAKE_C_COMPILER_TARGET=x86_64-w64-windows-gnu \
      -DCMAKE_CXX_COMPILER_TARGET=x86_64-w64-windows-gnu \
      -DCMAKE_SYSTEM_NAME=Windows \
      -DCMAKE_SYSTEM_PROCESSOR=x86_64 \
      -DCMAKE_INSTALL_PREFIX=${CPP_OUTPUT_DIR}/${info.name}/windows/x86_64
    `,
      buildStep: `cmake --build ${info.outDir}/windows/x86_64 -j`,
      installStep: `cmake --install ${info.outDir}/windows/x86_64`,
    },
    windows_aarch64: {
      configStep: `cmake -S . -B ${info.outDir}/windows/aarch64 -G Ninja \
      -DCMAKE_BUILD_TYPE=Release \
      -DZLIB_BUILD_STATIC=ON \
      -DBUILD_SHARED_LIBS=ON \
      -DZLIB_BUILD_MINIZIP=OFF \
      -DZLIB_BUILD_TESTING=OFF \
      -DCMAKE_C_COMPILER=${CLANG} \
      -DCMAKE_CXX_COMPILER=${CLANGXX} \
      -DCMAKE_RC_COMPILER=${AARCH64_WINDRES} \
      -DCMAKE_RC_FLAGS=--target=aarch64-w64-mingw32 \
      -DCMAKE_C_COMPILER_TARGET=aarch64-w64-windows-gnu \
      -DCMAKE_CXX_COMPILER_TARGET=aarch64-w64-windows-gnu \
      -DCMAKE_SYSTEM_NAME=Windows \
      -DCMAKE_SYSTEM_PROCESSOR=aarch64 \
      -DCMAKE_INSTALL_PREFIX=${CPP_OUTPUT_DIR}/${info.name}/windows/aarch64
      `,
      buildStep: `cmake --build ${info.outDir}/windows/aarch64 -j`,
      installStep: `cmake --install ${info.outDir}/windows/aarch64`,
    },
    linux_x86_64: {
      configStep: `cmake -S . -B ${info.outDir}/linux/x86_64 -G Ninja \
      -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLS}/linux_x86-64.cmake \
      -DCMAKE_BUILD_TYPE=Release \
      -DCMAKE_C_COMPILER=${CLANG} \
      -DCMAKE_CXX_COMPILER=${CLANGXX} \
      -DCMAKE_C_COMPILER_TARGET=x86_64-unknown-linux-gnu \
      -DCMAKE_CXX_COMPILER_TARGET=x86_64-unknown-linux-gnu \
      -DZLIB_BUILD_STATIC=ON \
      -DBUILD_SHARED_LIBS=ON \
      -DZLIB_BUILD_MINIZIP=OFF \
      -DZLIB_BUILD_TESTING=OFF \
      -DCMAKE_INSTALL_PREFIX=${CPP_OUTPUT_DIR}/${info.name}/linux/x86_64 
      `,

      buildStep: `cmake --build ${info.outDir}/linux/x86_64 -j`,
      installStep: `cmake --install ${info.outDir}/linux/x86_64`,
    },
    linux_aarch64: {
      configStep: `cmake -S . -B ${info.outDir}/linux/aarch64 -G Ninja \
      -DCMAKE_TOOLCHAIN_FILE=${CMAKE_TOOLS}/linux_aarch64.cmake \
      -DCMAKE_BUILD_TYPE=Release \
      -DCMAKE_C_COMPILER=${CLANG} \
      -DCMAKE_CXX_COMPILER=${CLANGXX} \
      -DCMAKE_C_COMPILER_TARGET=aarch64-unknown-linux-gnu \
      -DCMAKE_CXX_COMPILER_TARGET=aarch64-unknown-linux-gnu \
      -DZLIB_BUILD_STATIC=ON \
      -DBUILD_SHARED_LIBS=ON \
      -DZLIB_BUILD_MINIZIP=OFF \
      -DZLIB_BUILD_TESTING=OFF \
      -DCMAKE_INSTALL_PREFIX=${CPP_OUTPUT_DIR}/${info.name}/linux/aarch64
      `,
      buildStep: `cmake --build ${info.outDir}/linux/aarch64 -j`,
      installStep: `cmake --install ${info.outDir}/linux/aarch64`,
    },
  } satisfies BuildType;
};

const args = argv.slice(2);
const [action = "help"] = args;

const buildConfig: BuildConfiguration = {
  info,
  build: build(),
};

await runPackageAction(action, process.cwd(), buildConfig);
