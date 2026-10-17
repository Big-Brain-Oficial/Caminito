'use strict';

const $ = id => document.getElementById(id);
const controls = ['theta-prev', 'omega', 'delta-t', 'theta-a', 'alpha', 'phi', 'focal', 'baseline', 'disparity'];
const number = id => Number($(id).value);
const format = (value, digits = 2) => new Intl.NumberFormat('es-AR', {
  minimumFractionDigits: digits,
  maximumFractionDigits: digits
}).format(value);

function setValue(id, value, unit, digits) {
  $(`${id}-value`).textContent = `${format(value, digits)} ${unit}`;
}

function update() {
  const previous = number('theta-prev');
  const omega = number('omega');
  const deltaT = number('delta-t');
  const gravity = number('theta-a');
  const alpha = number('alpha');
  const phi = number('phi');
  const focal = number('focal');
  const baseline = number('baseline');
  const disparity = number('disparity');

  setValue('theta-prev', previous, 'rad', 3);
  setValue('omega', omega, 'rad/s', 2);
  setValue('delta-t', deltaT, 's', 2);
  setValue('theta-a', gravity, 'rad', 3);
  setValue('alpha', alpha, '', 2);
  setValue('phi', phi, 'rad', 3);
  setValue('focal', focal, 'px', 0);
  setValue('baseline', baseline, 'm', 2);
  setValue('disparity', disparity, 'px', 0);

  const theta = alpha * (previous + omega * deltaT) + (1 - alpha) * gravity;
  const slopeL = 100 * Math.tan(theta);
  const slopeT = 100 * Math.tan(phi);
  const depth = focal * baseline / disparity;

  $('theta-output').innerHTML = `${format(theta, 4)} <small>rad</small>`;
  $('filter-trace').textContent = `θₜ = ${format(alpha)} × (${format(previous, 3)} + ${format(omega)} × ${format(deltaT)}) + (1 − ${format(alpha)}) × ${format(gravity, 3)} = ${format(theta, 4)} rad`;
  $('slope-l').textContent = `${format(slopeL)} %`;
  $('slope-t').textContent = `${format(slopeT)} %`;
  $('slope-trace').textContent = `Pₗ = 100 × tan(${format(theta, 4)}) = ${format(slopeL)} % · Pₜ = 100 × tan(${format(phi, 3)}) = ${format(slopeT)} %`;
  $('depth-output').innerHTML = `${format(depth)} <small>m</small>`;
  $('depth-trace').textContent = `Z = (${format(focal, 0)} × ${format(baseline)}) / ${format(disparity, 0)} = ${format(depth)} m`;

  const slopeY = Math.max(55, Math.min(190, 170 - theta * 280));
  $('slope-line').setAttribute('d', `M40 170 L355 ${slopeY}`);
  $('slope-end').setAttribute('cy', slopeY);
  const pointY = Math.max(35, Math.min(145, 165 - depth * 34));
  $('left-ray').setAttribute('d', `M140 170 L300 ${pointY}`);
  $('right-ray').setAttribute('d', `M460 170 L300 ${pointY}`);
  $('depth-point').setAttribute('cy', pointY);
  $('depth-label').setAttribute('y', Math.max(20, pointY - 12));
}

controls.forEach(id => $(id).addEventListener('input', update));
update();
