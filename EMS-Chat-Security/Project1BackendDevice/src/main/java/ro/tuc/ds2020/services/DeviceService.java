package ro.tuc.ds2020.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ro.tuc.ds2020.controllers.handlers.exceptions.model.ResourceNotFoundException;
import ro.tuc.ds2020.dtos.DeviceDTO;
import ro.tuc.ds2020.dtos.DeviceDetailsDTO;
import ro.tuc.ds2020.dtos.builders.DeviceBuilder;
import ro.tuc.ds2020.entities.Device;
import ro.tuc.ds2020.repositories.DeviceRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DeviceService {
    private static final Logger LOGGER = LoggerFactory.getLogger(DeviceService.class);
    private final DeviceRepository deviceRepository;

    @Autowired
    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    public List<DeviceDTO> findDevices() {
        List<Device> deviceList = deviceRepository.findAll();
        return deviceList.stream()
                .map(DeviceBuilder::toDeviceDTO)
                .collect(Collectors.toList());
    }

    public DeviceDetailsDTO findDeviceById(UUID id) {
        Optional<Device> deviceOptional = deviceRepository.findById(id);
        if (!deviceOptional.isPresent()) {
            LOGGER.error("Device with id {} was not found in db", id);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + id);
        }
        return DeviceBuilder.toDeviceDetailsDTO(deviceOptional.get());
    }

    public UUID insert(DeviceDetailsDTO deviceDTO) {
        Device device = new Device(
                deviceDTO.getDescription(),
                deviceDTO.getAddress(),
                deviceDTO.getMaxhusage(),
                deviceDTO.getUserid()
        );
        device = deviceRepository.save(device);
        LOGGER.debug("Device with id {} was inserted in db", device.getId());
        return device.getId();
    }

    public UUID update(UUID deviceId, DeviceDetailsDTO deviceDTO) {
        Optional<Device> deviceOptional = deviceRepository.findById(deviceId);
        if (!deviceOptional.isPresent()) {
            LOGGER.error("Device with id {} was not found in db", deviceId);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + deviceId);
        }

        Device deviceToUpdate = deviceOptional.get();

        deviceToUpdate.setDescription(deviceDTO.getDescription());
        deviceToUpdate.setAddress(deviceDTO.getAddress());
        deviceToUpdate.setMaxhusage(deviceDTO.getMaxhusage());
        deviceToUpdate.setUserid(deviceDTO.getUserid());

        deviceRepository.save(deviceToUpdate);
        LOGGER.debug("Device with id {} was updated in db", deviceId);
        return deviceToUpdate.getId();
    }

    public void delete(UUID deviceId) {
        Optional<Device> deviceOptional = deviceRepository.findById(deviceId);
        if (!deviceOptional.isPresent()) {
            LOGGER.error("Device with id {} was not found in db", deviceId);
            throw new ResourceNotFoundException(Device.class.getSimpleName() + " with id: " + deviceId);
        }

        deviceRepository.delete(deviceOptional.get());
        LOGGER.debug("Device with id {} was deleted from db", deviceId);
    }

    public void deleteDevicesByUserId(UUID userId) {
        List<Device> devices = deviceRepository.findByUserid(userId);
        if (!devices.isEmpty()) {
            deviceRepository.deleteByUserid(userId);
            LOGGER.debug("Devices for user with id {} were deleted from db", userId);
        }
    }


    public List<DeviceDTO> findDevicesByUserId(UUID userId) {
        List<Device> devices = deviceRepository.findByUserid(userId); // Make sure this method exists in your repository

        return devices.stream()
                .map(device -> new DeviceDTO(device.getId(), device.getDescription(), device.getAddress(), device.getMaxhusage(), device.getUserid()))
                .collect(Collectors.toList());
    }
}
