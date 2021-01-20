#!/bin/bash

VER="${1#[vV]}"
IMG="dayanuyimable/taskman:$VER"

function usage {
    images="$(docker images --format '{{.Repository}}:{{.Tag}}' | grep "$IMG" | sort -r | sed 's/^/\t/')"

    cat >&2 <<-EOT
	usage: ${0##*/} <version, eg. 1.0.0>

	found old image in the system:
	$images
	EOT
}

if [[ -z "$VER" ]]; then
    usage
    exit 1
fi

if ! (git diff --exit-code && git diff --cached --exit-code ) &> /dev/null; then
    >&2 echo "error: you have uncommit code"
    exit 2
fi

if ! git push -n |& grep -q 'update-to-date'; then
    >&2 echo "error: you have unpushed code"
    exit 3
fi

docker build \
    --build-arg "GIT_HASH=$(git log --format="%h" -n1)" \
    --build-arg "APP_HOME=/root/taskman" \
    -t "$IMG" .

read -r -p "==> push image $IMG? [Y/n] " ans
if ! [[ $ans == [Nn]* ]]; then
    docker push "$IMG"
fi
