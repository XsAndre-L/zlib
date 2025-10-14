## Clean all

```bash
rm -rf build

rm -rf build-aarch64
rm -rf build/build-x86_64
```

## aarch64

```bash
cmake -S . -B build/build-aarch64 -G Ninja \
  -DCMAKE_BUILD_TYPE=Release \
  -DZLIB_BUILD_STATIC=ON \
  -DZLIB_BUILD_SHARED=OFF \
  -DZLIB_BUILD_MINIZIP=OFF \
  -DZLIB_BUILD_TESTING=OFF \
  -DCMAKE_C_COMPILER="D:/Toolchains/llvm-mingw/bin/clang.exe" \
  -DCMAKE_CXX_COMPILER="D:/Toolchains/llvm-mingw/bin/clang++.exe" \
  -DCMAKE_C_COMPILER_TARGET=aarch64-w64-windows-gnu \
  -DCMAKE_CXX_COMPILER_TARGET=aarch64-w64-windows-gnu \
  -DCMAKE_SYSTEM_NAME=Windows \
  -DCMAKE_SYSTEM_PROCESSOR=aarch64 \
  -DCMAKE_INSTALL_PREFIX="D:/Dev/Libs/zlib/aarch64"

cmake --build build/build-aarch64 -j

cmake --install build/build-aarch64
```

## x64

```bash
cmake -S . -B build/build-x86_64 -G Ninja \
  -DCMAKE_BUILD_TYPE=Release \
  -DZLIB_BUILD_STATIC=ON \
  -DZLIB_BUILD_SHARED=OFF \
  -DZLIB_BUILD_MINIZIP=OFF \
  -DZLIB_BUILD_TESTING=OFF \
  -DCMAKE_C_COMPILER="D:/Toolchains/llvm-mingw/bin/clang.exe" \
  -DCMAKE_CXX_COMPILER="D:/Toolchains/llvm-mingw/bin/clang++.exe" \
  -DCMAKE_C_COMPILER_TARGET=x86_64-w64-windows-gnu \
  -DCMAKE_CXX_COMPILER_TARGET=x86_64-w64-windows-gnu \
  -DCMAKE_SYSTEM_NAME=Windows \
  -DCMAKE_SYSTEM_PROCESSOR=x86_64 \
  -DCMAKE_INSTALL_PREFIX="D:/Dev/Libs/zlib/x86_64"

cmake --build build/build-x86_64 -j
cmake --install build/build-x86_64

cmake -S . -B build/build-x86_64 -G Ninja \
  -DCMAKE_BUILD_TYPE=Release \
  -DZLIB_BUILD_STATIC=ON \
  -DZLIB_BUILD_SHARED=OFF \
  -DZLIB_BUILD_MINIZIP=OFF \
  -DZLIB_BUILD_TESTING=OFF \
  -DCMAKE_C_COMPILER="D:/Toolchains/llvm-mingw/bin/clang.exe" \
  -DCMAKE_CXX_COMPILER="D:/Toolchains/llvm-mingw/bin/clang++.exe" \
  -DCMAKE_C_COMPILER_TARGET=x86_64-w64-windows-gnu \
  -DCMAKE_CXX_COMPILER_TARGET=x86_64-w64-windows-gnu \
  -DCMAKE_SYSTEM_NAME=Windows \
  -DCMAKE_SYSTEM_PROCESSOR=x86_64 \
  -DCMAKE_INSTALL_PREFIX="../../packages/out/zlib/x86_64"
```
